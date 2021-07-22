import {
  Linha as CajuLinha,
  Coluna as CajuColuna,
  Item,
  Ícone as CajuÍcone,
  Texto as CajuTexto,
  CampoDeTexto as CajuCampoDeTexto,
  Grade,
  solicite_escolha,
} from "./caju-aplicativo.js"

export class Comando extends CajuColuna {
  static selecionado
  static _ao_selecionar = []
  static _ao_desselecionar = []
  static ao_selecionar(chame) {
    Comando._ao_selecionar.push(chame)
  }
  static ao_desselecionar(chame) {
    Comando._ao_desselecionar.push(chame)
  }
  constructor(argumentos, retornos_aceitáveis, comandos) {
    super(0, 0, 2)
    this.e.tabIndex = 0
    if (retornos_aceitáveis === undefined) {
      this.escopo = []
    } else {
      this.escopo = Object.values(componentes).filter(Tipo => retornos_aceitáveis.indexOf(Tipo.retorna) > -1)
    }
    this.retornos_aceitáveis = retornos_aceitáveis
    this.linha = this.adicione(new CajuLinha(0, 0, 2))
    this.item_nome = this.linha.adicione(new Item(this.constructor.cor))
    this.identifique_se()
    this.argumentos = []
    this.grade_argumentos = this.linha.adicione(new Grade(0, 0, 0, 2))
    this.grade_argumentos.e.style.columnGap = "2px"
    if (argumentos) {
      for (var i = 0; i < argumentos.length; i++) {
        var argumento = {}
        this.argumentos.push(argumento)
        argumento.nome = argumentos[i][1]
        if (argumentos.length > 1) {
          argumento.item_nome = this.grade_argumentos.adicione(new Item(this.constructor.cor))
          argumento.item_nome.adicione(new CajuTexto(argumento.nome))
          argumento.item_nome.esconda()
          argumento.item_nome.e.style.borderLeftWidth = 0
          argumento.item_nome.e.style.justifyContent = "flex-end"
          this.grade_argumentos.e.style.marginLeft = -2
        }
        argumento.linha = this.grade_argumentos.adicione(new CajuLinha(0, 0, 2))
        if (i > 0) {
          argumento.linha.e.style.marginTop = 1
          argumento.item_nome.e.style.borderTopWidth = 0
        }
        if (i < argumentos.length - 1) {
          argumento.linha.e.style.marginBottom = 1
          argumento.item_nome.e.style.borderBottomWidth = 0
        }
        argumento.linha.esconda()
        argumento.definir = argumento.linha.adicione(new Item(argumentos[i][0]))
        if (argumentos[i][1].startsWith("...")) {
          argumento.definir.adicione(new CajuÍcone("plus-circle-outline"))
          argumento.valor = argumento.linha.adicione(new CajuColuna(0, 0, 2))
          argumentos[i][2].map(_argumento => {
            argumento.valor.adicione(new componentes[_argumento[0]](..._argumento.slice(1)))
          })
          this.selecione()
          this.desselecione()
        } else {
          argumento.definir.adicione(new CajuÍcone("chevron-left-circle-outline"))
          argumento.linha.remova = function(argumento, _remova, filho) {
            _remova.bind(argumento.linha)(filho)
            argumento.valor = undefined
          }.bind(this, argumento, argumento.linha.remova)
          if (argumentos[i][2] !== undefined && argumentos[i][2] !== null) {
            argumento.valor = argumento.linha.adicione(new componentes[argumentos[i][2][0]](...argumentos[i][2].slice(1)))
            this.selecione()
            this.desselecione()
          }
        }
        argumento.definir.selecione()
        argumento.escopo = argumentos[i][3]
        argumento.definir.ao_clicar(this.defina_argumento.bind(this, argumento))
      }
    }
    if (comandos !== undefined) {
      this.e.style.alignItems = "flex-start"
      this.bloco = {}
      this.bloco.linha = this.adicione(new CajuLinha(0, 0, 2))
      this.bloco.indentação = this.bloco.linha.adicione(new Item(this.constructor.cor, 3, 0, 8))
      this.bloco.indentação.margem_superior = -5
      this.bloco.indentação.margem_inferior = -5
      this.bloco.indentação.espessura_da_borda_superior = 0
      this.bloco.indentação.espessura_da_borda_inferior = 0
      this.bloco.indentação.camada = 1
      this.bloco.coluna = this.bloco.linha.adicione(new CajuColuna(0, 0, 2))
      this.bloco.coluna.e.style.alignItems = "flex-start"
      this.bloco.adicionar = this.bloco.coluna.adicione(new Item(this.constructor.cor))
      this.bloco.adicionar.esconda()
      this.bloco.adicionar.selecione()
      this.bloco.adicionar.adicione(new CajuÍcone("plus-circle-outline"))
      this.bloco.comandos = comandos.map(comando => this.bloco.coluna.adicione(new componentes[comando[0]](...comando.slice(1))))
      this.bloco.adicionar.ao_clicar(this.adicione_comando.bind(this, this.bloco))
      this.fim = this.adicione(new Item(this.constructor.cor, 3, 0, 8))
      this.fim.largura = 64
    }
    this.e.addEventListener("focus", function () {
      this.selecione()
    }.bind(this))
    this.e.addEventListener("blur", function () {
      this.desselecione()
    }.bind(this))
  }
  selecione() {
    Comando.selecionado = this
    Comando._ao_selecionar.map(c => c())
    this.item_nome.selecione()
    this.argumentos.map(argumento => {
      if (argumento.item_nome) {
        argumento.item_nome.mostre()
        argumento.item_nome.selecione()
        this.item_nome.e.style.borderRightWidth = 0
      }
      if (argumento.valor) {
        argumento.definir.mostre()
        argumento.linha.mostre()
      } else {
        argumento.definir.mostre()
        argumento.linha.mostre()
      }
    })
    if (this.bloco) {
      this.bloco.indentação.selecione()
      this.bloco.adicionar.mostre()
      this.fim.selecione()
    }
  }
  desselecione() {
    Comando._ao_desselecionar.map(c => c())
    this.item_nome.desselecione()
    this.item_nome.e.style.borderRightWidth = 3
    this.argumentos.map(argumento => {
      if (argumento.item_nome) {
        if (argumento.valor) {
          this.item_nome.e.style.borderRightWidth = 0
        } else {
          argumento.item_nome.esconda()
        }
        argumento.item_nome.desselecione()
      }
      if (argumento.valor) {
        argumento.definir.esconda()
      } else {
        argumento.linha.esconda()
      }
    })
    if (this.bloco) {
      this.bloco.indentação.desselecione()
      this.bloco.adicionar.esconda()
      this.fim.desselecione()
    }
  }
  estruture() {
    var estrutura = [this.constructor.name, this.argumentos.map(argumento => {
      if (argumento.nome.startsWith("...")) {
        return argumento.valor.filhos.map(_argumento => _argumento.estruture())
      } else {
        if (! argumento.valor) {
          return null
        }
        return argumento.valor.estruture()
      }
    })]
    if (this.bloco) {
      estrutura.push(this.bloco.coluna.filhos.filter(comando => comando instanceof Comando).map(comando => comando.estruture()))
    }
    return estrutura
  }
  defina_argumento(argumento, retorna) {
    var possibilidades = []
    possibilidades = Object.values(componentes).filter(Tipo => argumento.escopo.indexOf(Tipo.retorna) > -1).map(Tipo => [Tipo.cor, Tipo.nome, Tipo])
    solicite_escolha(possibilidades, Tipo => {
      if (argumento.nome.startsWith("...")) {
        argumento.valor.adicione(new Tipo())
      } else {
        argumento.valor = argumento.linha.adicione(new Tipo())
      }
      argumento.linha.mostre()
      argumento.definir.esconda()
      if (argumento.item_nome) {
        argumento.item_nome.mostre()
        this.item_nome.e.style.borderRightWidth = 0
      }
    })
  }
  identifique_se() {
    this.item_nome.adicione(new CajuTexto(this.constructor.nome))
  }
  adicione_comando(bloco) {
    var possibilidades = []
    possibilidades = [
      ...this.escopo,
      ...comandos_externos.filter(Tipo => this.retornos_aceitáveis.indexOf(Tipo.retorna) > -1),
    ].map(Tipo => [Tipo.cor, Tipo.nome, Tipo]),
    solicite_escolha(possibilidades, Tipo => {
      bloco.comandos.push(bloco.coluna.adicione(new Tipo()))
      bloco.coluna.e.appendChild(bloco.adicionar.e)
    })
  }
  avalie(globais) {
    this.bloco.coluna.filhos.map(comando => {
      if (comando instanceof Comando) {
        comando.avalie(globais)
      }
    })
  }
  js(globais, ...linhas) {
    globais["caju.corpo"] = globais["caju.corpo"].concat(linhas)
  }
  avalie_argumento(globais, i, ...linhas) {
    if (this.argumentos[i].valor) {
      this.js(globais,
        "(chame => {",
      )
      this.argumentos[i].valor.avalie(globais)
      this.js(globais,
        "})(valor => {",
          ...linhas,
        "});",
      )
    }
  }
}

export class Aplicativo extends Comando {
  static cor = "#d7ab32"
  static nome = "Aplicativo"
  constructor(argumentos=[], comandos=[]) {
    super(argumentos, ["aplicativo.nada"], comandos)
  }
  avalie(globais) {
    globais["caju.cabeçalho"] = [
      "<meta charset=\"utf-8\">",
      "<meta name=\"viewport\" content=\"width=device-width\">",
      "<body></body>",
      "<link href=\"https://cdn.jsdelivr.net/npm/@mdi/font@5.9.55/css/materialdesignicons.min.css\" rel=\"stylesheet\">",
      "<script type=\"module\">",
    ]
    globais["caju.corpo"] = []
    globais["caju.rodapé"] = [
      "</script>",
    ]
    this.js(globais,
        "var fluxo = {",
          "canais: {},",
          "atualize: (nome, valor) => {",
            "fluxo.canais[nome].map(chame => chame(valor));",
          "},",
          "ao_atualizar: (nome, chame) => {",
            "if (! fluxo.canais.hasOwnProperty(nome)) {",
              "fluxo.canais[nome] = [];",
            "};",
            "fluxo.canais[nome].push(chame);",
          "},",
        "};",
        "(pai => {",
          "pai.style.display = \"flex\";",
          "pai.style.flexDirection = \"column\";",
          "pai.style.margin = 0;"
    )
    super.avalie(globais)
    this.js(globais,
        "})(document.body);",
    )
    globais["caju.saída"] += globais["caju.cabeçalho"].join("")
    globais["caju.saída"] += globais["caju.corpo"].join("")
    globais["caju.saída"] += globais["caju.rodapé"].join("")
  }
}

export class Nome extends Comando {
  static cor = "#ed6d25"
  static nome = "Nome"
  static retorna = "aplicativo.nome"
  constructor(valor="") {
    super()
    this.valor.e.textContent = valor
  }
  identifique_se() {
    this.valor = this.item_nome.adicione(new CajuCampoDeTexto())
  }
  avalie(globais) {
    this.js(globais,
      "fluxo.ao_atualizar(\"" + this.valor.e.textContent + "\", valor => chame(valor));",
    )
  }
  estruture() {
    return ["Nome", this.valor.e.textContent]
  }
}

export class TipoTexto extends Comando {
  static cor = "#d53571"
  static nome = "\"\""
  static retorna = "aplicativo.texto"
  constructor(valor="") {
    super()
    this.valor.e.textContent = valor
  }
  identifique_se() {
    this.item_nome.adicione(new CajuTexto("\""))
    this.valor = this.item_nome.adicione(new CajuCampoDeTexto())
    this.item_nome.adicione(new CajuTexto("\""))
  }
  avalie(globais) {
    this.js(globais,
      "chame(\"" + this.valor.e.textContent + "\");"
    )
  }
  estruture() {
    return ["TipoTexto", this.valor.e.textContent]
  }
}

export class TipoNúmero extends Comando {
  static cor = "#3687c7"
  static nome = "0"
  static retorna = "aplicativo.número"
  constructor(valor=0) {
    super()
    this.valor.value = valor
  }
  identifique_se() {
    this.valor = document.createElement("input")
    this.valor.type = "number"
    this.item_nome.e.appendChild(this.valor)
  }
  avalie(globais) {
    this.js(globais,
      "chame(" + this.valor.value + ");",
    )
  }
  estruture() {
    return ["TipoNúmero", this.valor.value]
  }
}

export class Some extends Comando {
  static cor = "#3687c7"
  static nome = "+"
  static retorna = "aplicativo.número"
  constructor(argumentos=[[]]) {
    super([
      ["#3687c7", "...operandos", argumentos[0], [
        "aplicativo.nome",
        "aplicativo.número",
      ]],
    ])
  }
  avalie(globais) {
    this.js(globais,
      "var operandos = [];",
    )
    for (var i = 0; i < this.argumentos[0].valor.filhos.length; i++) {
      globais["caju.corpo"].push(
        "operandos.push(0);",
        "(chame => {",
      )
      this.argumentos[0].valor.filhos[i].avalie(globais)
      globais["caju.corpo"].push(
        "})(valor => {",
          "operandos[" + i + "] = valor;",
          "chame(operandos.reduce((a, b) => parseFloat(a) + parseFloat(b)));",
        "});",
      )
    }
  }
}

export class ComandoAtribua extends Comando {
  static cor = "#97669a"
  static nome = "="
  static retorna = "aplicativo.comando.nada"
  constructor(argumentos = [undefined, undefined]) {
    super([
      ["#ed6d25", "nome", argumentos[0], [
        "aplicativo.comando.nome",
      ]],
      ["#ed6d25", "valor", argumentos[1], [
        "aplicativo.comando.nome",
        "aplicativo.comando.número",
        "aplicativo.comando.texto",
      ]],
    ])
  }
  avalie(globais) {
    this.js(globais,
      "fluxo.atualize(\"",
    )
    this.argumentos[0].valor.avalie(globais)
    this.js(globais,
      "\",",
    )
    this.argumentos[1].valor.avalie(globais)
    this.js(globais,
      ");",
    )
  }
}

export class ComandoNome extends Comando {
  static cor = "#ed6d25"
  static nome = "Nome"
  static retorna = "aplicativo.comando.nome"
  constructor(valor = "") {
    super()
    this.valor.e.textContent = valor
  }
  identifique_se() {
    this.valor = this.item_nome.adicione(new CajuCampoDeTexto())
  }
  avalie(globais) {
    this.js(globais,
      this.valor.e.textContent,
    )
  }
  estruture() {
    return ["ComandoNome", this.valor.e.textContent]
  }
}

export class ComandoTipoTexto extends Comando {
  static cor = "#d53571"
  static nome = "\"\""
  static retorna = "aplicativo.comando.texto"
  constructor(valor = "") {
    super()
    this.valor.e.textContent = valor
  }
  identifique_se() {
    this.item_nome.adicione(new CajuTexto("\""))
    this.valor = this.item_nome.adicione(new CajuCampoDeTexto())
    this.item_nome.adicione(new CajuTexto("\""))
  }
  avalie(globais) {
    this.js(globais,
      "\"" + this.valor.e.textContent + "\"",
    )
  }
  estruture() {
    return ["ComandoTipoTexto", this.valor.e.textContent]
  }
}

export class ComandoTipoNúmero extends Comando {
  static cor = "#3687c7"
  static nome = "0"
  static retorna = "aplicativo.comando.número"
  constructor(valor = 0) {
    super()
    this.valor.value = valor
  }
  identifique_se() {
    this.valor = document.createElement("input")
    this.valor.type = "number"
    this.item_nome.e.appendChild(this.valor)
  }
  avalie(globais) {
    this.js(globais,
      this.valor.value,
    )
  }
  estruture() {
    return ["ComandoTipoNúmero", this.valor.value]
  }
}

export class Importe extends Comando {
  static cor = "#97669a"
  static nome = "Importe"
  static módulos = {}
  constructor(argumentos=[undefined]) {
    super([
      ["#d53571", "endereço", argumentos[0], [
        "caju.texto",
        "caju.valor",
      ]],
    ])
    if (argumentos[0] !== undefined) {
      var endereço = this.argumentos[0].valor.avalie()
      ;(async () => {
        var resposta = await fetch(endereço)
        var conteúdo = await resposta.json()
        Importe.módulos[endereço] = conteúdo.slice(1).map(objeto => {
          return new componentes[objeto[0]](...objeto.slice(1))
        })
      })()
    }
    this.argumentos[0].linha.adicione = function (_adicione, filho) {
      filho.valor.e.addEventListener("input", async function (filho) {
        var endereço = filho.avalie()
        var resposta = await fetch(endereço)
        var conteúdo = await resposta.json()
        Importe.módulos[endereço] = conteúdo.slice(1).map(objeto => {
          return new componentes[objeto[0]](...objeto.slice(1))
        })
      }.bind(this, filho))
      return _adicione(filho)
    }.bind(this, this.argumentos[0].linha.adicione.bind(this.argumentos[0].linha))
  }
  avalie(globais) {
  }
}

export class Exporte extends Comando {
  static cor = "#d7ab32"
  static nome = "Exporte"
  constructor(argumentos=[], comandos=[]) {
    super(argumentos, ["exporte.nada"], comandos)
  }
  avalie(globais) {
  }
}

export class CajuComando extends Comando {
  static cor = "#d7ab32"
  static nome = "Comando"
  static retorna = "exporte.nada"
  constructor(argumentos=[
    ["CajuTipoTexto", "#fff"],
    ["CajuTipoTexto", ""],
    ["CajuTipoTexto", "nada"],
    [],
    [],
  ], comandos=[]) {
    super([
      ["#909090", "cor", argumentos[0], [
        "caju.texto",
        "caju.cor",
      ]],
      ["#d53571", "nome", argumentos[1], [
        "caju.texto",
      ]],
      ["#d53571", "retorna", argumentos[2], [
        "caju.texto",
      ]],
      ["#330b9f", "...argumentos", argumentos[3], [
        "caju.argumento",
      ]],
      ["#d53571", "...retornos_aceitáveis", argumentos[4], [
        "caju.texto",
      ]],
    ], ["caju.nada"], comandos)
    var that = this
    this.Tipo = class extends Comando {
      static cor = that.argumentos[0].valor.avalie()
      static nome = that.argumentos[1].valor.avalie()
      static retorna = that.argumentos[2].valor.avalie()
      constructor(argumentos=[], comandos) {
        if (that.argumentos[3].valor.filhos.length > 0) {
          argumentos = that.argumentos[3].valor.filhos.map((filho, i) => {
            return [
              filho.argumentos[0].valor.avalie(),
              filho.argumentos[1].valor.avalie(),
              argumentos[i],
              filho.argumentos[2].valor.filhos.map(filho => filho.avalie()),
            ]
          })
        }
        var retornos_aceitáveis
        if (that.argumentos[4].valor.filhos.length > 0) {
          retornos_aceitáveis = that.argumentos[4].valor.filhos.map(filho => filho.avalie())
          if (comandos === undefined) {
            comandos = []
          }
        }
        super(argumentos, retornos_aceitáveis, comandos)
      }
      avalie(globais) {
        that.avalie(globais, this)
      }
    }
    comandos_externos.push(this.Tipo)
    if (this.argumentos[0].valor) {
      this.argumentos[0].valor.e.addEventListener("input", function (valor) {
        this.Tipo.cor = valor.avalie()
      }.bind(this, this.argumentos[0].valor))
    }
    this.argumentos[0].linha.adicione = function (_adicione, filho) {
      filho.valor.e.addEventListener("input", function (filho) {
        this.Tipo.cor = filho.avalie()
      }.bind(this, filho))
      return _adicione(filho)
    }.bind(this, this.argumentos[0].linha.adicione.bind(this.argumentos[0].linha))
    if (this.argumentos[1].valor) {
      this.argumentos[1].valor.e.addEventListener("input", function (valor) {
        this.Tipo.nome = valor.avalie()
      }.bind(this, this.argumentos[1].valor))
    }
    this.argumentos[1].linha.adicione = function (_adicione, filho) {
      filho.valor.e.addEventListener("input", function (filho) {
        this.Tipo.nome = filho.avalie()
      }.bind(this, filho))
      return _adicione(filho)
    }.bind(this, this.argumentos[1].linha.adicione.bind(this.argumentos[1].linha))
    if (this.argumentos[2].valor) {
      this.argumentos[2].valor.e.addEventListener("input", function (valor) {
        this.Tipo.retorna = valor.avalie()
      }.bind(this, this.argumentos[2].valor))
    }
    this.argumentos[2].linha.adicione = function (_adicione, filho) {
      filho.valor.e.addEventListener("input", function (filho) {
        this.Tipo.retorna = filho.avalie()
      }.bind(this, filho))
      return _adicione(filho)
    }.bind(this, this.argumentos[2].linha.adicione.bind(this.argumentos[2].linha))
  }
  avalie(globais, objeto) {
    this.bloco.coluna.filhos.map(comando => {
      if (comando instanceof CajuAvalieBloco) {
        objeto.bloco.coluna.filhos.map(comando => {
          if (comando instanceof Comando) {
            comando.avalie(globais)
          }
        })
      } else {
        if (comando instanceof Comando) {
          comando.avalie(globais, objeto)
        }
      }
    })
  }
}

export class CajuArgumento extends Comando {
  static cor = "#330b9f"
  static nome = "Argumento"
  static retorna = "caju.argumento"
  constructor(argumentos=[undefined, undefined, []]) {
    super([
      ["#909090", "cor", argumentos[0], [
        "caju.texto",
        "caju.cor",
      ]],
      ["#d53571", "nome", argumentos[1], [
        "caju.texto",
      ]],
      ["#d53571", "...retornos_aceitáveis", argumentos[2], [
        "caju.texto",
      ]],
    ])
  }
}

export class Caju extends Comando {
  static cor = "#d7ab32"
  static nome = "Caju"
  static retorna = "aplicativo.nada"
  constructor(argumentos=[], comandos = []) {
    super(argumentos, ["caju.nada"], comandos)
  }
  avalie(globais) {
    this.js(globais,
      "(() => {",
    )
    super.avalie(globais)
    this.js(globais,
      "})();",
    )
  }
}

export class CajuTipoTexto extends Comando {
  static cor = "#d53571"
  static nome = "\"\""
  static retorna = "caju.texto"
  constructor(valor="") {
    super()
    this.valor.e.textContent = valor
  }
  identifique_se() {
    this.item_nome.adicione(new CajuTexto("\""))
    this.valor = this.item_nome.adicione(new CajuCampoDeTexto())
    this.item_nome.adicione(new CajuTexto("\""))
  }
  avalie(globais) {
    return this.valor.e.textContent
  }
  estruture() {
    return ["CajuTipoTexto", this.valor.e.textContent]
  }
}

export class CajuTipoNúmero extends Comando {
  static cor = "#3687c7"
  static nome = "0"
  static retorna = "caju.número"
  constructor(valor=0) {
    super()
    this.valor.value = valor
  }
  identifique_se() {
    this.valor = document.createElement("input")
    this.valor.type = "number"
    this.item_nome.e.appendChild(this.valor)
  }
  avalie(globais) {
    return parseFloat(this.valor.value)
  }
  estruture() {
    return ["CajuTipoNúmero", this.valor.value]
  }
}

export class CajuAtribua extends Comando {
  static cor = "#97669a"
  static nome = "="
  static retorna = "caju.nada"
  constructor(argumentos = [undefined, undefined]) {
    super([
      ["#d53571", "nome", argumentos[0], [
        "caju.texto",
      ]],
      ["#ed6d25", "valor", argumentos[1], [
        "caju.número",
        "caju.texto",
        "caju.lógico",
        "caju.valor",
      ]],
    ])
  }
  avalie(globais) {
    globais[this.argumentos[0].valor.avalie(globais)] = this.argumentos[1].valor.avalie(globais)
  }
}

export class CajuObtenha extends Comando {
  static cor = "#ed6d25"
  static nome = "."
  static retorna = "caju.valor"
  constructor(argumentos = [undefined, undefined]) {
    super([
      ["#ed6d25", "nome", argumentos[0], [
        "caju.texto",
      ]],
    ])
  }
  avalie(globais) {
    return globais[this.argumentos[0].valor.avalie(globais)]
  }
}

export class CajuSome extends Comando {
  static cor = "#3687c7"
  static nome = "+"
  static retorna = "caju.número"
  constructor(argumentos=[[]]) {
    super([
      ["#ed6d25", "...operandos", argumentos[0], [
        "caju.número",
        "caju.valor",
      ]],
    ])
  }
  avalie(globais) {
    return this.argumentos[0].valor.filhos.reduce((a, b) => a.avalie(globais) + b.avalie(globais))
  }
}

export class CajuSubtraia extends Comando {
  static cor = "#3687c7"
  static nome = "-"
  static retorna = "caju.número"
  constructor(argumentos=[[]]) {
    super([
      ["#ed6d25", "...operandos", argumentos[0], [
        "caju.número",
        "caju.valor",
      ]],
    ])
  }
  avalie(globais) {
    return this.argumentos[0].valor.filhos.reduce((a, b) => a.avalie(globais) - b.avalie(globais))
  }
}

export class CajuIncluaNaLista extends Comando {
  static cor = "#97669a"
  static nome = "inclua_na_lista"
  static retorna = "caju.nada"
  constructor(argumentos = [undefined, undefined]) {
    super([
      ["#ed6d25", "nome", argumentos[0], [
        "caju.texto",
        "caju.valor",
      ]],
      ["#ed6d25", "valor", argumentos[1], [
        "caju.número",
        "caju.texto",
        "caju.lógico",
        "caju.valor",
      ]],
    ])
  }
  avalie(globais) {
    globais[this.argumentos[0].valor.avalie(globais)].push(this.argumentos[1].valor.avalie(globais))
  }
}

export class CajuAvalieArgumento extends Comando {
  static cor = "#d7ab32"
  static nome = "avalie_argumento"
  static retorna = "caju.nada"
  constructor(argumentos=[undefined], comandos=[]) {
    super([
      ["#3687c7", "i", argumentos[0], [
        "caju.número",
        "caju.valor",
      ]],
    ], ["caju.nada"], comandos)
  }
  avalie(globais, objeto) {
    var i = this.argumentos[0].valor.avalie()
    if (objeto.argumentos[i].valor) {
      this.js(globais,
        "(chame => {",
      )
      objeto.argumentos[i].valor.avalie(globais)
      this.js(globais,
        "})(valor => {",
      )
      super.avalie(globais)
      this.js(globais,
        "});",
      )
    }
  }
}

export class CajuAvalieArgumentoEstaticamente extends Comando {
  static cor = "#97669a"
  static nome = "avalie_argumento_estaticamente"
  static retorna = "caju.nada"
  constructor(argumentos=[undefined], comandos=[]) {
    super([
      ["#3687c7", "i", argumentos[0], [
        "caju.número",
        "caju.valor",
      ]],
    ])
  }
  avalie(globais, objeto) {
    objeto.argumentos[this.argumentos[0].valor.avalie()].valor.avalie(globais)
  }
}

export class CajuAvalieBloco extends Comando {
  static cor = "#97669a"
  static nome = "avalie_bloco"
  static retorna = "caju.nada"
}

export class CajuSe extends Comando {
  static cor = "#d7ab32"
  static nome = "se"
  static retorna = "caju.nada"
  constructor(argumentos=[undefined], comandos = []) {
    super([
      ["#ed6d25", "condição", argumentos[0], [
        "caju.lógico",
        "caju.valor",
      ]],
    ], ["caju.nada", "caju.senão"], comandos)
  }
  avalie(globais) {
    if (this.argumentos[0].valor.avalie(globais)) {
      this.js(globais,
        "(() => {",
      )
      this.bloco.coluna.filhos.map(comando => {
        if (! (comando instanceof CajuSenão) && (comando instanceof Comando)) {
          comando.avalie(globais)
        }
      })
      this.js(globais,
        "})();",
      )
    } else {
      this.bloco.coluna.filhos.map(comando => {
        if (comando instanceof CajuSenão) {
          comando.avalie(globais)
        }
      })
    }
  }
}

export class CajuSenão extends Comando {
  static cor = "#d7ab32"
  static nome = "senão"
  static retorna = "caju.senão"
  constructor(argumentos=[], comandos = []) {
    super(argumentos, ["caju.nada"], comandos)
  }
  avalie(globais) {
    this.js(globais,
      "(() => {",
    )
    super.avalie(globais)
    this.js(globais,
      "})();",
    )
  }
}

export class CajuEnquanto extends Comando {
  static cor = "#d7ab32"
  static nome = "enquanto"
  static retorna = "caju.nada"
  constructor(argumentos=[undefined], comandos = []) {
    super([
      ["#ed6d25", "condição", argumentos[0], [
        "caju.lógico",
        "caju.valor",
      ]],
    ], ["caju.nada"], comandos)
  }
  avalie(globais) {
    this.js(globais,
      "(() => {",
    )
    while (this.argumentos[0].valor.avalie(globais)) {
      super.avalie(globais)
    }
    this.js(globais,
      "})();",
    )
  }
}

export class CajuIguais extends Comando {
  static cor = "#77b940"
  static nome = "=="
  static retorna = "caju.lógico"
  constructor(argumentos=[[]]) {
    super([
      ["#ed6d25", "...operandos", argumentos[0], [
        "caju.texto",
        "caju.número",
        "caju.valor",
      ]],
    ])
  }
  avalie(globais) {
    return this.argumentos[0].valor.filhos.reduce((a, b) => a.avalie(globais) === b.avalie(globais))
  }
}

export class CajuDiferentes extends Comando {
  static cor = "#77b940"
  static nome = "!="
  static retorna = "caju.lógico"
  constructor(argumentos=[[]]) {
    super([
      ["#ed6d25", "...operandos", argumentos[0], [
        "caju.texto",
        "caju.número",
        "caju.valor",
      ]],
    ])
  }
  avalie(globais) {
    return this.argumentos[0].valor.filhos.reduce((a, b) => a.avalie(globais) !== b.avalie(globais))
  }
}

export var componentes = {
  Aplicativo,
  Página,
  CampoDeNúmero,
  CampoDeTexto,
  Some,
  TipoTexto,
  TipoNúmero,
  Nome,
  AoClicar,
  ComandoAtribua,
  ComandoNome,
  ComandoTipoTexto,
  ComandoTipoNúmero,
  Importe,
  Exporte,
  CajuComando,
  CajuArgumento,
  Caju,
  CajuTipoTexto,
  CajuTipoNúmero,
  CajuAtribua,
  CajuObtenha,
  CajuSome,
  CajuSubtraia,
  CajuIncluaNaLista,
  CajuAvalieArgumento,
  CajuAvalieArgumentoEstaticamente,
  CajuAvalieBloco,
  CajuSe,
  CajuSenão,
  CajuEnquanto,
  CajuIguais,
  CajuDiferentes,
}

export var comandos_externos = []
