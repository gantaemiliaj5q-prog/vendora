import type { Profile } from './types'

/** Verifică dacă profilul are rol de admin (coloana `is_admin`). */
export function isAdminProfile(
  profile: Pick<Profile, 'is_admin'> | null | undefined
): boolean {
  if (!profile) return false
  return profile.is_admin === true
}