export default async function handler(req, res) {
    const target = `http://109.73.206.144:6969${req.url}`;
    const response = await fetch(target);
    const data = await response.text();

    res.setHeader("Content-Type", "application/json");
    res.status(response.status).send(data);
}