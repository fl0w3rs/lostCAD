module.exports = {
  message: 'admin/departments/edit',
  callback: async ({
    socket, data, utils, db, emitReturn, Validator, vtemplates,
  }) => {
    if (!(await socket.isAdmin())) return emitReturn('error');

    const dept = await db.cad.Department.findOne({ where: { id: data.id } });
    if (!dept) return emitReturn('error');

    const validation = new Validator(data, {
      id: 'required|numeric',
      ...vtemplates.rules.department,
    });

    validation.setAttributeNames({
      ...vtemplates.names.department,
    });

    if (validation.fails()) {
      socket.emit('errorNotifyUnescaped', Object.values(validation.errors.all()).join('<br/>'));
      return emitReturn('error');
    }

    // delete data.id;
    Object.assign(dept, data);

    await dept.save();

    utils.clearCache('allDepartments');

    emitReturn('success');

    return true;
  },
};
