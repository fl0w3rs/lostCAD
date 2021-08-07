module.exports = {
    message: 'admin/getAllGroupNames',
    callback: async ({ socket, db, emitReturn }) => {
        if (!(await socket.isAdmin())) return

        let resp = (await db.forum.sequelize.query(`
            SELECT g.g_id, l.word_custom FROM core_groups g INNER JOIN core_sys_lang_words l ON l.word_key = CONCAT('core_group_', g.g_id)
        `))[0]

        let data = [];
        for (let i = 0; i < resp.length; i += 1) {
            data.push({ id: resp[i].g_id, name: resp[i].word_custom })
        }

        emitReturn({ list: data });
    }
}