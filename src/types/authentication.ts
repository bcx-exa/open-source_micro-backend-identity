// Authentication Request Types
export interface SignUp {
  preferred_username: string,
  password: string,
  accepted_legal_version: string,
  given_name: string,
  family_name: string
}

export interface SignIn {
  username: string,
  password: string
}
