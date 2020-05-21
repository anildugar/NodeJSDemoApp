'use strict';
var express = require('express');
var router = express.Router();

const pg = require('pg');

module.exports = class DatabaseService
{
    constructor()
    {
        var connectionString = `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
        this.dbPool = new pg.Client(connectionString);
        this.dbPool.connect();

        /* this.dbPool = new pg.Pool({
            database: process.env.DB_NAME,
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT
        }); */
    }

    async registerUser(email, pwd, displayname)
    {
        var query = `INSERT into tbl_gameusers VALUES(DEFAULT,\'${email}\', \'${displayname}\', \'${pwd}\',\'TRUE\',\'TRUE\' ) `;
        await this.dbPool.query(query);
    }

    async getAllUsers()
    {       
        const {rows} = await this.dbPool.query('Select * from tbl_gameusers');
        return  rows;
    }

    async getUserFromEmailId(emailId)
    {
        const { rows } = await this.dbPool.query('SELECT * FROM tbl_gameusers WHERE emailId = $1', [emailId]);
        return rows;
    }

    async DeleteAllRegisteredUsers()
    {
        await this.dbPool.query('Delete from tbl_gameusers');
    }

    async DeleteRegisterationTable()
    {
        await this.dbPool.query('Drop table tbl_gameusers');
    }

    async CreateRegisterUserTable()
    {
        //var createextension = 'CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\"';
        //await dbPool.query(createextension);
        //var createTableQuery = 'CREATE TABLE RegisterUser(id uuid DEFAULT uuid_generate_v4(),emailId VARCHAR(40) NOT NULL PRIMARY KEY ,displayname VARCHAR(40) NOT NULL, password VARCHAR(40) NOT NULL, isactive BOOLEAN NOT NULL,  canorganizegame BOOLEAN NOT NULL)';
        //await dbPool.query(createTableQuery);
    }
}

