import { NextResponse } from "next/server"

export async function POST(req) {
    try {
        const { newBody, accessToken } = await req.json()
// console.log(newBody)
// console.log(accessToken)

        const response = await fetch(
            "https://istudio.uniqa.ua/webapi/offerCalc",
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
            { error: "Failed to fetch offer calculation" },
            { status: 500 }
        )
    }
}
