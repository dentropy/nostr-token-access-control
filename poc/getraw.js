const relay_url = "ws://localhost:6969"
import { v4 as uuidv4 } from 'uuid';
const wsListen = new WebSocket(relay_url)
wsListen.addEventListener('open', async (event) => {
    console.log("EVENT_EVENT_EVENT")
    console.log(event)
    let filter_uuid = String(uuidv4())
    let filter_data = `["REQ","${filter_uuid}",${ JSON.stringify({ids : ["d201532f471466d20fc49f6775d12cf0f2601caedae5d3d2938cc7d961bd2398"] }) }]`
    console.log("filter_data")
    console.log(filter_data)
    wsListen.send(filter_data)
})
wsListen.addEventListener('message', async (event) => {
    console.log("wsListen_PAUL_WAS_HERE_2")
    console.log(event.data)
    try {
        let event_data = JSON.parse(event.data)
        let nostr_event = JSON.parse(event_data[2])
        console.log("PARSED_DATA")
        console.log(event_data[0])
        console.log(event_data[2])
        console.log("token_initalize.id")
        console.log(nostr_event.id)
        console.log(event_data[0] == "EVENT")
        console.log("SOMETHING")
        console.log(nostr_event.id)
        console.log(token_initalize.id)
        console.log(nostr_event.id == token_initalize.id)
        if (
            event_data[0] == "EVENT" &&
            nostr_event.id == token_initalize.id
        ) {
            console.log("PAUL_WAS_HERE_3")
            console.log(mint_events)
            mint_events.push(nostr_event)
        }
    } catch (error) { 
        console.log("WE_GOT_AN_ERROR")
    }
})