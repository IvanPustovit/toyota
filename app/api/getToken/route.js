import { NextResponse } from "next/server"

export async function POST(req) {
    try {
        
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/token`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({
                    grant_type: "password",
                    username: process.env.NEXT_PUBLIC_TOKEN_LOGIN,
                    password: process.env.NEXT_PUBLIC_TOKEN_PASSWORD,
                }),
            }
        )

        if (!response.ok) {
            throw new Error("Network response was not ok")
        }

        const data = await response.json()
        return NextResponse.json(data, { status: 200 })
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch token" },
            { status: 500 }
        )
    }
}
