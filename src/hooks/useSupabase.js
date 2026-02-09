import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useSiteContent(keys) {
  const [content, setContent] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!keys || keys.length === 0) {
      setLoading(false)
      return
    }

    let cancelled = false

    async function fetch() {
      setLoading(true)
      const { data, error: err } = await supabase
        .from('site_content')
        .select('key, value')
        .in('key', keys)

      if (cancelled) return

      if (err) {
        setError(err)
        setLoading(false)
        return
      }

      const mapped = (data || []).reduce((acc, row) => {
        acc[row.key] = row.value
        return acc
      }, {})
      setContent(mapped)
      setLoading(false)
    }

    fetch()
    return () => { cancelled = true }
  }, [JSON.stringify(keys)])

  return { content, loading, error }
}

export function useTable(tableName, options = {}) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const { orderBy, ascending = false, filters = {}, limit } = options

  useEffect(() => {
    let cancelled = false

    async function fetch() {
      setLoading(true)
      let query = supabase.from(tableName).select('*')

      Object.entries(filters).forEach(([col, val]) => {
        query = query.eq(col, val)
      })

      if (orderBy) {
        query = query.order(orderBy, { ascending })
      }

      if (limit) {
        query = query.limit(limit)
      }

      const { data: rows, error: err } = await query

      if (cancelled) return

      if (err) {
        setError(err)
        setLoading(false)
        return
      }

      setData(rows || [])
      setLoading(false)
    }

    fetch()
    return () => { cancelled = true }
  }, [tableName, JSON.stringify(filters), orderBy, ascending, limit])

  return { data, loading, error, refetch: () => setLoading(true) }
}

export function useSubmit(tableName) {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  async function submit(row) {
    setSubmitting(true)
    setError(null)
    setSuccess(false)

    const { error: err } = await supabase.from(tableName).insert(row)

    setSubmitting(false)

    if (err) {
      setError(err)
      return false
    }

    setSuccess(true)
    return true
  }

  function reset() {
    setError(null)
    setSuccess(false)
  }

  return { submit, submitting, error, success, reset }
}
