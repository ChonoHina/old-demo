import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  // 获取浏览器发来的账号密码信息
  const basicAuth = req.headers.get('authorization')
  const url = req.nextUrl

  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1]
    // 解码 Base64
    const [user, pwd] = atob(authValue).split(':')

    // 这里读取我们在 Vercel 里设置的密码
    // 如果没有设置环境变量，默认账号是 admin，密码是 password
    const validUser = process.env.BASIC_AUTH_USER || 'admin'
    const validPass = process.env.BASIC_AUTH_PASSWORD || 'password'

    if (user === validUser && pwd === validPass) {
      return NextResponse.next()
    }
  }

  // 如果验证失败，弹窗要求输入密码
  url.pathname = '/api/auth'
  return new NextResponse('Auth Required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Secure Area"',
    },
  })
}
