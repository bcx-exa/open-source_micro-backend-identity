export interface openid
{
  sub: string,
  iss: string,
  aud: string,
  iat: number,
  auth_time: number
} 

export interface profile
{
  preferred_username: string,
  given_name: string,
  family_name: string,
  address: string,
  birthdate: Date,
  locale: string,
  picture: string,
  created_at: Date,
  updated_at: Date
}

export interface email
{
  email: string,
  email_verified: boolean
}

export interface phone
{
  phone_number: string,
  phone_number_verified: boolean  
  
}

