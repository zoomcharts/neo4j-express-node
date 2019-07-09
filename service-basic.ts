
import {DB} from './db'
const db = new DB();

let nodes:any = {};
let links:any = {};

function pushLinks(new_links:Array<any>){
    for (let i = 0; i < new_links.length; i++){
        let link:any = new_links[i];
        let linkId:string = link.identity.toString();
        if (typeof(links[linkId]) == "undefined"){
            links[linkId] = {
                id: linkId,
                from: link.start.toString(),
                to: link.end.toString(),
                type: link.type
            }
        }
    }
}

function pushNodes(new_nodes:Array<any>){
    for (let i = 0; i < new_nodes.length; i++){
        let node:any = new_nodes[i];
        let nodeId:string = node.identity.toString();
        if (typeof(nodes[nodeId]) == "undefined"){
            nodes[nodeId] = {
                id: nodeId,
                extra: {
                    type: node.labels[0],
                    properties: node.properties
                },
                loaded: true
            }
        }
    }
}

let response = {nodes: [], links: []};
let session = db.getSession();

async function getData(){
    await session.run(
        'match (a)-[r]->(b) return a,b,r'
    )
    .then((result:any) => {
        for (let i = 0; i < result.records.length; i++){
            let record = result.records[i];

            let n1 = record.get("a");
            let n2 = record.get("b");

            let r1 = record.get("r");

            pushNodes([n1,n2]);
            pushLinks([r1]);

        }
    });
 
    for (let i in nodes){
        if (nodes.hasOwnProperty(i)) response.nodes.push(nodes[i]);
    }
    for (let i in links){
        if (links.hasOwnProperty(i)) response.links.push(links[i]);
    }

    console.log("Links in data set", response.links.length);
    console.log("Nodes in data set", response.nodes.length);
}

getData();

const express = require('express')
const fs = require('fs')
const app = express()
const port = 3000

app.get('/data', (req, res) => res.send(response));
app.get('/', (req, res) => {
   fs.readFile('example.html', (err, data) => {
      res.send(data.toString());
   });  
})
app.listen(port, () => console.log(`Example app listening on port ${port}!`))


