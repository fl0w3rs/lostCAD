module.exports = {
    desc: 'Получение всех департаментов',
    message: 'admin/departments/getAll',
    callback: async ({ socket, utils, emitMessage }) => {
        if(!(await socket.isAdmin())) return

        let departments = await utils.getAllDepartments()
        
        emitMessage('admin/departments/getAll', departments)
    }
}