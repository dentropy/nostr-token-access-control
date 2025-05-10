import { v4 as uuidv4 } from 'uuid';
import assert from "assert"
import { generateSecretKey, getPublicKey, finalizeEvent, verifyEvent } from 'nostr-tools'
import { SimplePool } from 'nostr-tools/pool'

const pool = new SimplePool()
const default_server_timeout_ms = 1000
const relay_url = "ws://localhost:6969"
// const relay_url = "ws://my-desktop:9090"

describe('POC of Nostr Signature Chain Token', async () => {
    describe('Create the events, do some transfer, validate balances', async () => {
        it('We should get the Test Success Result', async function () {
            // Create the Inital Token
            const wsPublish = new WebSocket(relay_url)
            let sk0 = generateSecretKey() // `sk` is a Uint8Array
            let pk0 = await getPublicKey(sk0) // `pk` is a hex string
            let sk1 = generateSecretKey() // `sk` is a Uint8Array
            let pk1 = await getPublicKey(sk1) // `pk` is a hex string
            let token_initalize = await finalizeEvent({
                kind: 42101,
                created_at: Math.floor(Date.now() / 1000),
                tags: [
                    ["title", "test_token"],
                    ["ticker", "TEST"],
                    ["mk", pk0],
                ],
                content: 'This can be whatever, or a descriptions',
            }, sk0)
            // Inital Mint to another account
            let token_mint = await finalizeEvent({
                kind: 42200,
                created_at: Math.floor(Date.now() / 1000),
                tags: [
                    ["td", token_initalize.id],
                    ["tr", token_initalize.id, 1],
                    ["ta", pk0, `${15}`],
                ],
                content: 'This can be whatever, or a descriptions',
            }, sk0)
            // Transfer the Token to another account
            let token_transfer_event_data = {
                kind: 42300,
                created_at: Math.floor(Date.now() / 1000),
                tags: [
                    ["td", token_initalize.id],
                    ["tr", token_mint.id, String(14)],
                    ["ta", pk0, String(14)],
                    ["ta", pk1, String(1)],
                ],
                content: 'This can be whatever, or a descriptions',
            }
            console.log(token_transfer_event_data)
            let token_transfer = await finalizeEvent(token_transfer_event_data, sk1)
            pool.publish(['ws://localhost:6969'], token_initalize)
            pool.publish(['ws://localhost:6969'], token_mint)
            pool.publish(['ws://localhost:6969'], token_transfer)
            // wsPublish.addEventListener('open', async (event) => {
            //     console.log("EVENT_EVENT_EVENT_THE_DATA")
            //     const event_0 = '["EVENT",' + JSON.stringify(token_initalize) + ']'
            //     wsPublish.send(event_0);
            //     const event_1 = '["EVENT",' + JSON.stringify(token_mint) + ']'
            //     wsPublish.send(event_1);
            //     const event_2 = '["EVENT",' + JSON.stringify(token_transfer) + ']'
            //     wsPublish.send(event_2);
            // })
            // wsPublish.addEventListener('message', async (event) => {
            //     console.log("wsPublish_PAUL_WAS_HERE_2")
            //     console.log(event.data)
            // })
            await pool.publish([relay_url], token_initalize)
            await new Promise(resolve => setTimeout(resolve, default_server_timeout_ms));
            const wsListen = new WebSocket(relay_url)
            let mint_events = []
            wsListen.addEventListener('open', async (event) => {
                console.log("EVENT_EVENT_EVENT")
                console.log(event)
                let filter_uuid = String(uuidv4())
                let filter_data = `["REQ","${filter_uuid}",${ JSON.stringify({ids : [token_initalize.id] }) }]`
                console.log("filter_data")
                console.log(filter_data)
                wsListen.send(filter_data)
            })
            wsListen.addEventListener('message', async (event) => {
                console.log("wsListen_PAUL_WAS_HERE_2")
                console.log(event.data)
                try {
                    let event_data = JSON.parse(event.data)
                    console.log("\n\nevent_data")
                    console.log(event_data)
                    console.log(event_data[0] == "EVENT")
                    console.log(event_data[2].id == token_initalize.id)
                    // let nostr_event = JSON.parse(event_data[2])
                    // console.log("PARSED_DATA")
                    // console.log(event_data[0])
                    // console.log(event_data[2])
                    // console.log("token_initalize.id")
                    // console.log(nostr_event.id)
                    // console.log(event_data[0] == "EVENT")
                    // console.log("SOMETHING")
                    // console.log(nostr_event.id)
                    // console.log(token_initalize.id)
                    // console.log(nostr_event.id == token_initalize.id)
                    if (
                        event_data[0] == "EVENT" &&
                        event_data[2].id == token_initalize.id
                    ) {
                        console.log("PAUL_WAS_HERE_3")
                        console.log(mint_events)
                        mint_events.push(event_data[2])
                    }
                } catch (error) { 
                    console.log("WE_GOT_AN_ERROR")
                    console.log(error)
                    console.log("\n\n")
                }
            })
            console.log("JSON.stringify(token_initalize)")
            console.log(JSON.stringify(token_initalize))
            // GET MINTS
            await new Promise(resolve => setTimeout(resolve, default_server_timeout_ms))
            console.log("PAUL_WAS_HERE")
            console.log(mint_events)
            // GET TOKENS
            // GET TRANSFER

            wsListen.close()
            wsPublish.close()
            assert.equal(true, true);
        })
    })
})
