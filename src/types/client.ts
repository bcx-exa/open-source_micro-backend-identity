export interface ClientPost
{
  client_id?: string,
  client_name: string,
  client_secret: string,
  trusted: boolean,
  redirect_uris: string[]
}