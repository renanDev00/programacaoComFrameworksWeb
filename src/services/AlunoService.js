const prisma = require("../databases/prisma");
const AlunoInvalidoError = require("../errors/AlunoInvalidoError");
const AlunoNaoEncontradoError = require("../errors/AlunoNaoEncontradoError");

class AlunoService {
  async findMany(page, pageSize, orderBy, order) {
    if (order !== "asc" && order !== "desc") {
      throw new AlunoInvalidoError(
        "O parâmetro 'order' deve ser 'asc' ou 'desc'.",
      );
    }

    const numeroPage = Number(page);
    const numeroPageSize = Number(pageSize);

    if (!Number.isInteger(numeroPage) || numeroPage < 1) {
      throw new AlunoInvalidoError(
        "O parâmetro 'page' deve ser um número inteiro maior que zero.",
      );
    }

    if (!Number.isInteger(numeroPageSize) || numeroPageSize < 1) {
      throw new AlunoInvalidoError(
        "O parâmetro 'pageSize' deve ser um número inteiro maior que zero.",
      );
    }
    //SELECT * FROM alunos
    const alunos = await prisma.aluno.findMany({
      skip: (numeroPage - 1) * numeroPageSize,
      take: Number(numeroPageSize),
      orderBy: {
        [orderBy]: order,
      },
    });
    const total = await prisma.aluno.count();
    return { alunos, total };
  }

  async findUnique(id) {
    const aluno = await prisma.aluno.findUnique({
      where: {
        id: id,
      },
    });

    if (!aluno) {
      throw new AlunoNaoEncontradoError();
    }

    return aluno;
  }

  async create(aluno) {
    const { nome, email } = aluno;
    if (!nome || !email) {
      throw new AlunoInvalidoError();
    }
    //create = insert
    //update = update
    //delete = delete
    //findMany = select * from
    const novoAluno = await prisma.aluno.create({ data: aluno });

    return novoAluno;
  }

  async update(id, dados) {
    // Justificativa: Reaprovei o AlunoInvalidoError (400), pois enviar um corpo vazio
    // é um erro de validação de dados, com o mesmo peso de enviar dados incorretos.
    if (!dados || Object.keys(dados).length === 0) {
      throw new AlunoInvalidoError(
        "Nenhum dado válido foi fornecido para atualização.",
      );
    }

    // Justificativa: Reaprovei o findUnique, que já lança a exceção AlunoNaoEncontradoError (404)
    // caso o aluno não exista. Isso evita duplicar a lógica de busca e erro.
    await this.findUnique(id);

    try {
      const alunoAtualizado = await prisma.aluno.update({
        where: {
          id: id,
        },
        data: dados,
      });

      return alunoAtualizado;
    } catch (e) {
      // Justificativa: O código P2002 é retornado pelo Prisma quando há violação de restrição @unique.
      // Reaprovei o AlunoInvalidoError para converter o erro do banco em uma mensagem legível para o usuário.
      if (e.code === "P2002") {
        throw new AlunoInvalidoError(
          "O email informado já pertence a outro aluno.",
        );
      }

      throw e;
    }
  }

  async delete(id) {
    await this.findUnique(id);

    await prisma.aluno.delete({
      where: {
        id: id,
      },
    });
  }
}

module.exports = new AlunoService();
