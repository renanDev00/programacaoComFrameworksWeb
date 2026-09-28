const alunoService = require("../services/AlunoService");

class AlunoController {
  async findMany(request, response) {
    try {
      let { page, pageSize, orderBy, order } = request.query;
      page ||= 1;
      pageSize ||= 10;
      orderBy ||= "id";
      order ||= "asc";

      const resultado = await alunoService.findMany(
        page,
        pageSize,
        orderBy,
        order,
      );
      return response.status(200).json(resultado);
    } catch (e) {
      return response.status(e.statusCode || 400).json({ error: e.message });
    }
  }

  async create(request, response) {
    try {
      const aluno = await alunoService.create(request.body);
      return response.status(201).json({ aluno });
    } catch (e) {
      return response.status(e.statusCode).json({ error: e.message });
    }
  }
}

module.exports = new AlunoController();
