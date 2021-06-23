module.exports = {
    message: 'admin/departments/delete',
    callback: async ({ socket, data, utils, db, emitReturn }) => {
        if(!(await socket.isAdmin())) return

        const id = Number(data);

        const resp = await db.cad.Department.findOne({ where: { id } });
        if(!resp) return emitReturn('error');

        await db.cad.Department.destroy({ where: { id } });

        utils.clearCache('allDepartments');
        
        emitReturn('success')
    }
}