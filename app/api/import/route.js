import { NextResponse } from "next/server"

export async function POST(req) {
  // console.log(await req.json())
    try {
        const { newBody, accessToken } = await req.json()
// console.log(newBody)
// console.log(accessToken)

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL_TEST}/api/importicd/v2`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(newBody),
            }
        )

        if (!response.ok) {
            throw new Error("Network response was not ok")
        }

        const data = await response.json()
        return NextResponse.json(data, { status: 200 })
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch import" },
            { status: 500 }
        )
    }
}
