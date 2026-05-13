export async function onRequestPost(context) {
    const { request, env } = context;

    const corsHeaders = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    };

    try {
        const { password } = await request.json();
        
        // This uses the 'secret_' binding from your dashboard
        const correctPassword = await env.secret_.get("GALLERY_PASS");

        if (password === correctPassword) {
            const images = await env.secret_.get("IMAGE_LIST");
            return new Response(images, {
                headers: { ...corsHeaders, "Content-Type": "application/json" }
            });
        }

        return new Response(JSON.stringify({ error: "Unauthorized" }), { 
            status: 401, 
            headers: corsHeaders 
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: "Server Error" }), { 
            status: 500, 
            headers: corsHeaders 
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
