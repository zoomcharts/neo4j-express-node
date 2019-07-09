export class DB {
    private driver;
    public constructor(){
        const neo4j = require('neo4j-driver').v1;

        const uri = 'bolt://localhost';
        const user = 'neo4j';
        const password = '12341234';

        this.driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

    }
    public getSession(){
        let session = this.driver.session();
        return session;
    }
    public closeDriver(){
        this.driver.close();
    }
}
