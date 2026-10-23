export async function json(request, response) {
    let body = '';

    for await (const chunk of request) {
        body += chunk;
    }
    try {
        request.body = JSON.parse(body);
    } catch {
        request.body = null;
    }

    response.setHeader('Content-Type', 'application/json');
}