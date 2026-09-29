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

  async findUnique(request, response) {
    try {
      const idTexto = request.params.id;
      const idNumero = Number(idTexto);

      if (!Number.isInteger(idNumero)) {
        return response
          .status(400)
          .json({ error: "O ID fornecido deve ser um número válido." });
      }

      const aluno = await alunoService.findUnique(idNumero);

      return response.status(200).json({ aluno });
    } catch (e) {
      return response.status(e.statusCode || 500).json({ error: e.message });
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

  async update(request, response) {
    try {
      const idTexto = request.params.id;
      const idNumero = Number(idTexto);

      if (!Number.isInteger(idNumero)) {
        return response
          .status(400)
          .json({ error: "O ID fornecido deve ser um número válido." });
      }

      const aluno = await alunoService.update(idNumero, request.body);

      return response.status(200).json({ aluno });
    } catch (e) {
      return response.status(e.statusCode || 500).json({ error: e.message });
    }
  }

  async delete(request, response) {
    try {
      const idTexto = request.params.id;
      const idNumero = Number(idTexto);

      if (!Number.isInteger(idNumero)) {
        return response
          .status(400)
          .json({ error: "O ID fornecido deve ser um número válido." });
      }

      await alunoService.delete(idNumero);

      return response.status(204).send();
    } catch (e) {
      return response.status(e.statusCode || 500).json({ error: e.message });
    }
  }
}

module.exports = new AlunoController();
