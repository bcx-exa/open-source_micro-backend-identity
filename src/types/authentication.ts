// Authentication Request Types
export interface SignUp {
  preferred_username: string,
  password: string,
  given_name: string,
  family_name: string
}

export interface SignIn {
  preferred_username: string,
  password: string
}
