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
  constructor(argumentos, comandos) {
    super(0, 0, 2)
    this.e.tabIndex = 0
    this.escopo = Object.values(componentes).filter(Tipo => Tipo.retorna == "nada")
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
        argumento.definir = argumento.linha.adicione(new Item(argumentos[i][0]))
        if (argumentos[i][1].startsWith("...")) {
          argumento.definir.adicione(new CajuÍcone("plus-circle-outline"))
          argumento.valor = argumento.linha.adicione(new CajuColuna(0, 0, 2))
          argumentos[i][2].map(_argumento => {
            argumento.valor.adicione(new componentes[_argumento[0]](..._argumento.slice(1)))
          })
        } else {
          argumento.definir.adicione(new CajuÍcone("chevron-left-circle-outline"))
          if (argumentos[i][2] !== undefined && argumentos[i][2] !== null) {
            argumento.valor = argumento.linha.adicione(new componentes[argumentos[i][2][0]](...argumentos[i][2].slice(1)))
          }
        }
        argumento.definir.selecione()
        argumento.linha.esconda()
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
    possibilidades = this.escopo.map(Tipo => [Tipo.cor, Tipo.nome, Tipo])
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
    super(argumentos, comandos)
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

export class Leiaute extends Comando {
  static cor = "#d7ab32"
  static retorna = "nada"
  constructor(argumentos=[undefined, undefined, undefined], comandos=[]) {
    super([
      ["#d53571", "cor_de_fundo", argumentos[0], [
        "texto",
        "nome",
      ]],
      ["#3687c7", "altura", argumentos[1], [
        "número",
        "nome",
      ]],
      ["#3687c7", "largura", argumentos[2], [
        "número",
        "nome",
      ]],
    ], comandos)
  }
  avalie(globais, direção) {
    this.js(globais,
      "pai.appendChild((pai => {",
        "pai.style.display = \"flex\";",
        "pai.style.flexDirection = \"" + direção + "\";",
        "pai.style.alignItems = \"center\";",
    )
    this.avalie_argumento(globais, 0,
          "pai.style.backgroundColor = valor;",
    )
    this.avalie_argumento(globais, 1,
          "pai.style.height = valor;",
    )
    this.avalie_argumento(globais, 2,
      "pai.style.width = valor;",
    )
    super.avalie(globais)
    this.js(globais,
        "return pai;",
      "})(document.createElement(\"span\")));",
    )
  }
}

export class Coluna extends Leiaute {
  static nome = "Coluna"
  avalie(globais) {
    super.avalie(globais, "column")
  }
}

export class Linha extends Leiaute {
  static nome = "Linha"
  avalie(globais) {
    super.avalie(globais, "row")
  }
}

export class Espaço extends Comando {
  static cor = "#97669a"
  static nome = "Espaço"
  static retorna = "nada"
  avalie(globais) {
    this.js(globais,
      "pai.appendChild((espaço => {",
        "espaço.style.flexGrow = 1;",
        "return espaço;",
      "})(document.createElement(\"span\")));",
    )
  }
}

export class Livro extends Comando {
  static cor = "#d7ab32"
  static nome = "Livro"
  static retorna = "nada"
  constructor(argumentos = [undefined], comandos = []) {
    super([
        ["#ed6d25", "página", argumentos[0], [
          "nome",
        ]],
      ], comandos)
    this.escopo = [
      Página,
    ]
  }
  avalie(globais) {
    this.js(globais,
      "pai.appendChild((pai => {",
    )
    this.avalie_argumento(globais, 0,
          "[...pai.children].map(página => {",
            "if (página.nome == valor) {",
              "página.style.display = \"block\";",
            "} else {",
              "página.style.display = \"none\";",
            "}",
          "});",
    )
    super.avalie(globais)
    this.js(globais,
        "[...pai.children].slice(1).map(página => {",
          "página.style.display = \"none\";",
        "});",
        "return pai;",
      "})(document.createElement(\"div\")));",
    )
  }
}

export class Página extends Comando {
  static cor = "#d7ab32"
  static nome = "Página"
  constructor(argumentos = [undefined], comandos = []) {
    super([
        ["#d53571", "nome", argumentos[0], [
          "comando.texto",
        ]],
      ], comandos)
  }
  avalie(globais) {
    this.js(globais,
      "pai.appendChild((pai => {",
        "pai.nome = "
    )
    this.argumentos[0].valor.avalie(globais)
    this.js(globais,
        ";",
    )
    super.avalie(globais)
    this.js(globais,
        "return pai;",
      "})(document.createElement(\"div\")));",
    )
  }
}

export class Texto extends Comando {
  static cor = "#97669a"
  static nome = "Texto"
  static retorna = "nada"
  constructor(argumentos=[undefined]) {
    super([
      ["#d53571", "valor", argumentos[0], [
        "texto",
        "nome",
        "número",
      ]],
    ])
  }
  avalie(globais) {
    this.js(globais,
      "(texto => {",
        "pai.appendChild(texto);",
    )
    this.avalie_argumento(globais, 0,
          "texto.textContent = valor;",
    )
    this.js(globais,
      "})(document.createElement(\"p\"));"
    )
  }
}

export class Ícone extends Comando {
  static cor = "#97669a"
  static nome = "Ícone"
  static retorna = "nada"
  constructor(argumentos=[undefined]) {
    super([
      ["#d53571", "nome", argumentos[0], [
        "texto",
        "nome",
      ]],
    ])
  }
  avalie(globais) {
    this.js(globais,
      "(ícone => {",
        "pai.appendChild(ícone);",
        "ícone.classList.add(\"mdi\");",
    )
    this.avalie_argumento(globais, 0,
          "ícone.classList.add(\"mdi-\" + valor);",
    )
    this.js(globais,
      "})(document.createElement(\"span\"));"
    )
  }
}

export class Campo extends Comando {
  static cor = "#97669a"
  static retorna = "nada"
  constructor(argumentos=[undefined]) {
    super([
      ["#ed6d25", "nome", argumentos[0], [
        "nome",
      ]],
    ])
  }
  avalie(globais, tipo) {
    this.js(globais,
      "(campo => {",
        "pai.appendChild(campo);",
        "campo.type = \"" + tipo + "\";",
        "campo.style.flexGrow = 1;",
        "campo.addEventListener(\"input\", e => fluxo.atualize(\"" + this.argumentos[0].valor.valor.e.textContent + "\", campo.value));",
      "})(document.createElement(\"input\"));",
    )
  }
}

export class CampoDeNúmero extends Campo {
  static nome = "CampoDeNúmero"
  avalie(globais) {
    super.avalie(globais, "number")
  }
}

export class CampoDeTexto extends Campo {
  static nome = "CampoDeTexto"
  avalie(globais) {
    super.avalie(globais, "text")
  }
}

export class Nome extends Comando {
  static cor = "#ed6d25"
  static nome = "Nome"
  static retorna = "nome"
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
  static retorna = "texto"
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
  static retorna = "número"
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
  static retorna = "número"
  constructor(argumentos=[[]]) {
    super([
      ["#3687c7", "...operandos", argumentos[0], [
        "nome",
        "número",
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

export class AoClicar extends Comando {
  static cor = "#d7ab32"
  static nome = "AoClicar"
  static retorna = "nada"
  constructor(argumentos=[], comandos = []) {
    super(argumentos, comandos)
    this.escopo = Object.values(componentes).filter(Tipo => Tipo.retorna == "comando.nada")
  }
  avalie(globais) {
    this.js(globais,
      "pai.addEventListener(\"click\", () => {",
    )
    super.avalie(globais)
    this.js(globais,
      "});",
    )
  }
}

export class ComandoAtribua extends Comando {
  static cor = "#97669a"
  static nome = "="
  static retorna = "comando.nada"
  constructor(argumentos = [undefined, undefined]) {
    super([
      ["#ed6d25", "nome", argumentos[0], [
        "comando.nome",
      ]],
      ["#ed6d25", "valor", argumentos[1], [
        "comando.nome",
        "comando.número",
        "comando.texto",
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
  static retorna = "comando.nome"
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
  static retorna = "comando.texto"
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
  static retorna = "comando.número"
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

export class Caju extends Comando {
  static cor = "#d7ab32"
  static nome = "Caju"
  static retorna = "nada"
  constructor(argumentos=[], comandos = []) {
    super(argumentos, comandos)
    this.escopo = Object.values(componentes).filter(Tipo => Tipo.retorna == "caju.nada")
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
    ], comandos)
    this.escopo = Object.values(componentes).filter(Tipo => Tipo.retorna == "caju.nada").concat([CajuSenão])
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
  constructor(argumentos=[], comandos = []) {
    super(argumentos, comandos)
    this.escopo = Object.values(componentes).filter(Tipo => Tipo.retorna == "caju.nada")
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
    ], comandos)
    this.escopo = Object.values(componentes).filter(Tipo => Tipo.retorna == "caju.nada")
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
  Coluna,
  Linha,
  Espaço,
  Livro,
  Página,
  Texto,
  Ícone,
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
  Caju,
  CajuTipoTexto,
  CajuTipoNúmero,
  CajuAtribua,
  CajuObtenha,
  CajuSome,
  CajuSubtraia,
  CajuIncluaNaLista,
  CajuSe,
  CajuSenão,
  CajuEnquanto,
  CajuIguais,
  CajuDiferentes,
}
