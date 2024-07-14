const Database = require('../database');
const database = new Database();

async function getAdminUser(query){
    const sql = `SELECT distinct U.user_id, U.first_name || ' ' || U.last_name name, U.profile_picture, U.department, U.batch
                    FROM users U
                    LEFT OUTER JOIN research_interests RI on U.user_id = RI.user_id
                    LEFT OUTER JOIN education E on U.user_id = E.user_id
                    LEFT OUTER JOIN work_experience WE on U.user_id = WE.user_id
                    WHERE U.first_name || ' ' || U.last_name like UPPER('%'||:name||'%')
                    AND (U.batch = :batch OR :batch is null) 
                    AND (U.department = :department OR :department is null)
                    AND NVL(U.hall, ' ') like UPPER('%'||:hall ||'%')
                    AND U.city like UPPER('%'||:city||'%')
                    AND NVL(U.state, ' ') like UPPER('%'||:state||'%')
                    AND U.country like UPPER('%'||:country||'%')
                    AND NVL(RI.research_interest, ' ') like UPPER('%'||:research_interest||'%')
                    AND NVL(E.institute,' ') like UPPER('%'||:e_institute||'%')
                    AND NVL(WE.organization, ' ') like UPPER('%'||:we_organization||'%')`;
    const binds ={
        name : query.name,
        batch : query.batch,
        department : query.department,
        hall : query.hall,
        city : query.city,
        state : query.state,
        country : query.country,
        research_interest : query.research_interest,
        e_institute : query.e_institute,
        we_organization : query.we_organization

    };
    
    return (await database.execute(sql, binds)).rows;
    
}

module.exports = {
    getAdminUser
}