// applies nextauth.js to the entire project
export { default } from 'next-auth/middleware'

// applies nextauth.js only to matching routes 
export const config = { matcher: ['/career-match-up', '/tryout'] }
