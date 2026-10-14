import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const DATA_DIR = path.join(process.cwd(), 'data')
const DATA_FILE = path.join(DATA_DIR, 'likes.json')

async function readCounts(): Promise<Record<string, number>> {
	try {
		const raw = await fs.readFile(DATA_FILE, 'utf8')
		const parsed = JSON.parse(raw)
		return typeof parsed === 'object' && parsed !== null ? parsed : {}
	} catch {
		return {}
	}
}

async function writeCounts(counts: Record<string, number>) {
	await fs.mkdir(DATA_DIR, { recursive: true })
	await fs.writeFile(DATA_FILE, JSON.stringify(counts), 'utf8')
}

export async function GET(request: NextRequest) {
	const slug = request.nextUrl.searchParams.get('slug') ?? ''
	const counts = await readCounts()
	return NextResponse.json({ count: counts[slug] ?? 0 })
}

export async function POST(request: NextRequest) {
	const slug = request.nextUrl.searchParams.get('slug') ?? ''
	if (!slug) {
		return NextResponse.json({ count: 0 })
	}

	const counts = await readCounts()
	const cookieName = `liked_${Buffer.from(slug).toString('base64url')}`

	if (request.cookies.has(cookieName)) {
		return NextResponse.json({ count: counts[slug] ?? 0, reason: 'rate_limited' })
	}

	counts[slug] = (counts[slug] ?? 0) + 1
	await writeCounts(counts)

	const response = NextResponse.json({ count: counts[slug] })
	response.cookies.set(cookieName, '1', { maxAge: 60 * 60 * 24, path: '/' })
	return response
}