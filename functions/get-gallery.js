export async function onRequestPost(context) {
    const { request, env } = context;

    const corsHeaders = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    };

    try {
        // 1. Check if KV binding exists
        if (!env.secret_) {
            return new Response(JSON.stringify({ error: "KV Binding 'secret_' not found" }), { 
                status: 500, headers: corsHeaders 
            });
        }

        const body = await request.json();
        const userPass = body.password;
        
        // 2. Fetch from KV
        const correctPassword = await env.secret_.get("GALLERY_PASS");
        const images = await env.secret_.get("IMAGE_LIST");

        // 3. Logic check
        if (userPass === correctPassword) {
            // Fallback to empty array if IMAGE_LIST is missing in KV
            const responseData = images ? images : "[]";
            return new Response(responseData, {
                headers: { ...corsHeaders, "Content-Type": "application/json" }
            });
        }

        return new Response(JSON.stringify({ error: "Unauthorized" }), { 
            status: 401, headers: corsHeaders 
        });

    } catch (err) {
        // This will tell us EXACTLY what the error is in ReqBin
        return new Response(JSON.stringify({ error: err.message }), { 
            status: 500, headers: corsHeaders 
        });
    }
}

export async function onRequestOptions() {
    return new Response(null, {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        },
    });
}
