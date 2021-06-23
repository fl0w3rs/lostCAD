module.exports = {
    message: 'user/identifiers/delete',
    callback: async ({ db, socket, data }) => {
        if(!socket.isAuthenticated) return

        if(
            !await socket.isDepartmentTypeAvailable('police') &&
            !await socket.isDepartmentTypeAvailable('dispatch') &&
            !await socket.isDepartmentTypeAvailable('fire')
        ) return

        let identifier = await db.cad.Identifier.findOne({
            where: {
                id: data,
                userId: socket.userId,
            }
        })

        if(!identifier) return;

        await db.cad.Identifier.destroy({ where: { id: data } });

        await socket.updateIdentifiers();
    }   
}