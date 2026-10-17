import { useState } from 'react'
import { supabase } from './supabase.js'

export default function Auth() {
  const [modo, setModo] = useState('entrar') // 'entrar' | 'registro'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [aviso, setAviso] = useState('')
  const [enviando, setEnviando] = useState(false)

  async function enviar(e) {
    e.preventDefault()
    setError('')
    setAviso('')
    setEnviando(true)

    const { data, error } =
      modo === 'entrar'
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password })

    setEnviando(false)
    if (error) return setError(error.message)
    // Si "Confirm email" sigue activo en Supabase, el registro no trae sesión
    if (modo === 'registro' && !data.session) {
      setAviso('Cuenta creada. Revisa tu correo para confirmarla.')
    }
  }

  const entrando = modo === 'entrar'

  return (
    <form className="tarjeta auth" onSubmit={enviar}>
      <h2>{entrando ? 'Inicia sesión' : 'Crea tu cuenta'}</h2>

      <label>
        Correo electrónico
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </label>

      <label>
        Contraseña
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={6}
          required
        />
      </label>

      {error && <p className="error">{error}</p>}
      {aviso && <p className="aviso">{aviso}</p>}

      <button type="submit" disabled={enviando}>
        {enviando ? 'Un momento…' : entrando ? 'Iniciar sesión' : 'Registrarme'}
      </button>

      <p className="cambio">
        {entrando ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
        <button type="button" className="enlace" onClick={() => setModo(entrando ? 'registro' : 'entrar')}>
          {entrando ? 'Crear cuenta' : 'Iniciar sesión'}
        </button>
      </p>
    </form>
  )
}
