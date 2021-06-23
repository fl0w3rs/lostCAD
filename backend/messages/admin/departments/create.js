module.exports = {
    message: 'admin/departments/create',
    callback: async ({ socket, data, utils, db, emitReturn, Validator, vtemplates }) => {
        if(!(await socket.isAdmin())) return

        let validation = new Validator(data, {
            ...vtemplates.rules.department
        });

        validation.setAttributeNames({
            ...vtemplates.names.department
        });

        if(validation.fails()) {
            socket.emit('errorNotifyUnescaped', Object.values(validation.errors.all()).join('<br/>'))
            emitReturn('error')
            return
        }

        await db.cad.Department.create(data);

        utils.clearCache('allDepartments');
        
        emitReturn('success')
    }
}