import {
  Linha,
  Coluna,
  Item,
  Ícone,
  Texto as CajuTexto,
  CampoDeTexto,
  Grade,
  solicite_escolha,
} from "./caju-aplicativo.js"

export class Comando extends Linha {
  constructor(cor, nome, argumentos) {
    super(0, 0, 2)
    this.nome = nome
    this.e.tabIndex = 0
    this.menu = this.adicione(new Linha(0, 0, 2))
    this.menu.camada = 2
    this.menu.e.style.position = "relative"
    this.menu.e.style.width = "0px"
    this.menu.e.style.top = "-68px"
    this.menu.e.style.marginRight = "-2px"
    this.deletar = this.menu.adicione(new Item(cor))
    this.deletar.adicione(new Ícone("delete"))
    this.deletar.selecione()
    this.deletar.ao_clicar(() => {
      this.pai.remova(this)
    })
    this.menu.esconda()
    this.item_nome = this.adicione(new Item(cor))
    this.identifique_se()
    this.argumentos = []
    this.grade_argumentos = this.adicione(new Grade(0, 0, 0, 2))
    this.grade_argumentos.e.style.columnGap = "2px"
    if (argumentos) {
      for (var i = 0; i < argumentos.length; i++) {
        var argumento = {}
        this.argumentos.push(argumento)
        argumento.nome = argumentos[i][0]
        argumento.linha = this.grade_argumentos.adicione(new Linha(0, 0, 2))
        argumento.definir = argumento.linha.adicione(new Item(cor))
        if (argumentos[i][0].startsWith("...")) {
          argumento.definir.adicione(new Ícone("plus-circle-outline"))
          argumento.valor = argumento.linha.adicione(new Coluna(0, 0, 2))
          argumentos[i][1].map(_argumento => {
            argumento.valor.adicione(new componentes[_argumento[0]](..._argumento.slice(1)))
          })
        } else {
          argumento.definir.adicione(new Ícone("chevron-left-circle-outline"))
          if (argumentos[i][1] !== undefined) {
            argumento.valor = argumento.linha.adicione(new componentes[argumentos[i][1][0]](...argumentos[i][1].slice(1)))
          }
        }
        argumento.definir.selecione()
        argumento.definir.esconda()
        argumento.definir.ao_clicar(this.defina_argumento.bind(this, argumento))
      }
    }
    this.e.addEventListener("focus", function () {
      this.selecione()
    }.bind(this))
    this.e.addEventListener("blur", function () {
      this.desselecione()
    }.bind(this))
  }
  selecione() {
    this.menu.mostre()
    this.item_nome.selecione()
    this.argumentos.map(argumento => {
      argumento.definir.mostre()
    })
  }
  desselecione() {
    this.menu.esconda()
    this.item_nome.desselecione()
    this.argumentos.map(argumento => {
      argumento.definir.esconda()
    })
  }
  estruture() {
    return [this.constructor.name, this.argumentos.map(argumento => {
      if (argumento.nome.startsWith("...")) {
        return argumento.valor.filhos.map(_argumento => _argumento.estruture())
      } else {
        return argumento.valor.estruture()
      }
    })]
  }
  defina_argumento(argumento, retorna) {
    var possibilidades = []
    possibilidades = this.escopo.map(Tipo => [Tipo.cor, Tipo.nome, Tipo])
    solicite_escolha(possibilidades, Tipo => {
      if (argumento.nome.startsWith("...")) {
        argumento.valor.adicione(new Tipo())
      } else {
        argumento.valor = argumento.linha.adicione(new Tipo())
      }
    })
  }
  identifique_se() {
    this.item_nome.adicione(new CajuTexto(this.nome))
  }
}

export class BlocoDeComandos extends Coluna {
  constructor(argumentos, comandos) {
    super(0, 0, 2)
    this.e.style.alignItems = "flex-start"
    this.e.tabIndex = 0
    this.bloco = this.adicione(new Comando(this.constructor.cor, this.constructor.nome))
    this.bloco.deletar.ao_clicar(() => {
      this.pai.remova(this)
    })
    this.bloco.e.removeAttribute("tabIndex")
    this.bloco.linha = this.adicione(new Linha(0, 0, 2))
    this.bloco.indentação = this.bloco.linha.adicione(new Item(this.constructor.cor, 3, 0, 8))
    this.bloco.indentação.margem_superior = -5
    this.bloco.indentação.margem_inferior = -5
    this.bloco.indentação.espessura_da_borda_superior = 0
    this.bloco.indentação.espessura_da_borda_inferior = 0
    this.bloco.indentação.camada = 1
    this.bloco.coluna = this.bloco.linha.adicione(new Coluna(0, 0, 2))
    this.bloco.coluna.e.style.alignItems = "flex-start"
    this.bloco.adicionar = this.bloco.coluna.adicione(new Item(this.constructor.cor))
    this.bloco.adicionar.esconda()
    this.bloco.adicionar.selecione()
    this.bloco.adicionar.adicione(new Ícone("plus-circle-outline"))
    this.bloco.comandos = comandos.map(comando => this.bloco.coluna.adicione(new componentes[comando[0]](...comando.slice(1))))
    this.bloco.adicionar.ao_clicar(this.adicione_comando.bind(this, this.bloco))
    this.fim = this.adicione(new Item(this.constructor.cor, 3, 0, 8))
    this.fim.largura = 64
    this.e.addEventListener("focus", function () {
      this.selecione()
    }.bind(this))
    this.e.addEventListener("blur", function () {
      this.desselecione()
    }.bind(this))
  }
  selecione() {
    if (this.e.offsetTop <= 72) {
      this.e.style.marginTop = 68
    }
    this.bloco.menu.mostre()
    this.bloco.selecione()
    this.bloco.indentação.selecione()
    this.bloco.adicionar.mostre()
    this.fim.selecione()
  }
  desselecione() {
    this.e.style.marginTop = 0
    this.bloco.menu.esconda()
    this.bloco.desselecione()
    this.bloco.indentação.desselecione()
    this.bloco.adicionar.esconda()
    this.fim.desselecione()
  }
  estruture() {
    return [this.constructor.name, [], this.bloco.coluna.filhos.filter(comando => comando instanceof Comando).map(comando => comando.estruture())]
  }
  adicione_comando(bloco) {
    var possibilidades = []
    possibilidades = this.escopo.map(Tipo => [Tipo.cor, Tipo.name, Tipo])
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
}

export class Aplicativo extends BlocoDeComandos {
  static cor = "#d7ab32"
  static nome = "Aplicativo"
  constructor(argumentos=[], comandos=[]) {
    super(argumentos, comandos)
    this.escopo = [
      Texto,
      CampoDeNúmero,
    ]
  }
  avalie(globais) {
    globais["caju.componentes"] = new Set([
      "Coluna",
    ])
    globais["caju.cabeçalho"] = [
      "<meta charset=\"utf-8\">",
      "<body></body>",
      "<script type=\"module\">",
    ]
    globais["caju.corpo"] = [
      "var aplicativo = new Coluna();",
      "aplicativo.largura = \"100%\";",
      "document.body.appendChild(aplicativo.e);",
    ]
    globais["caju.rodapé"] = [
      "</script>",
    ]
    super.avalie(globais)
    globais["caju.cabeçalho"].push("import { " + [...globais["caju.componentes"]].join(",") + " } from \"https://cajueiro.herokuapp.com/angelonuffer/caju/0.0.0/caju-aplicativo.js\";")
    globais["caju.saída"] += globais["caju.cabeçalho"].join("")
    globais["caju.saída"] += globais["caju.corpo"].join("")
    globais["caju.saída"] += globais["caju.rodapé"].join("")
  }
}

export class Texto extends Comando {
  static cor = "#97669a"
  constructor(argumentos=[undefined]) {
    super(Texto.cor, "Texto", ["valor"].map((nome, i) => [nome, argumentos[i]]))
    this.escopo = [
      TipoTexto,
      Nome,
      Some,
    ]
  }
  avalie(globais) {
    globais["caju.componentes"].add("Texto")
    globais["caju.corpo"].push("aplicativo.adicione((() => {" +
    "var texto = new Texto(\"\", 24, \"#000000\");" +
    "((chame) => {" +
    this.argumentos[0].valor.avalie(globais) +
    "})((valor) => {" +
    "texto.valor = valor;" +
    "});" +
    "return texto;" +
    "})());")
  }
}

export class CampoDeNúmero extends Comando {
  static cor = "#97669a"
  constructor(argumentos=[undefined]) {
    super(Texto.cor, "CampoDeNúmero", ["nome"].map((nome, i) => [nome, argumentos[i]]))
    this.escopo = [
      Nome,
    ]
  }
  avalie(globais) {
    globais["caju.componentes"].add("CampoDeNúmero")
    globais["caju.corpo"].push("aplicativo.adicione((() => {" +
    "var campo = new CampoDeNúmero();" +
    "campo.e.name = \"" + this.argumentos[0].valor.valor.e.textContent + "\";" +
    "campo.e.c = campo;" +
    "return campo;" +
    "})());")
  }
}

export class Nome extends Comando {
  static cor = "#ed6d25"
  static nome = "Nome"
  constructor(valor="") {
    super(Nome.cor)
    this.valor.e.textContent = valor
  }
  identifique_se() {
    this.valor = this.item_nome.adicione(new CampoDeTexto())
  }
  avalie(globais) {
    return "var referência = document.getElementsByName(\"" + this.valor.e.textContent + "\")[0].c;" +
      "referência.ao_modificar(() => chame(referência.valor));"
  }
  estruture() {
    return ["Nome", this.valor.e.textContent]
  }
}

export class TipoTexto extends Comando {
  static cor = "#d53571"
  static nome = "\"\""
  constructor(valor="") {
    super(TipoTexto.cor)
    this.valor.e.textContent = valor
  }
  identifique_se() {
    this.item_nome.adicione(new CajuTexto("\""))
    this.valor = this.item_nome.adicione(new CampoDeTexto())
    this.item_nome.adicione(new CajuTexto("\""))
  }
  avalie(globais) {
    return "chame(\"" + this.valor.e.textContent + "\")"
  }
  estruture() {
    return ["TipoTexto", this.valor.e.textContent]
  }
}

export class Some extends Comando {
  static cor = "#3687c7"
  static nome = "+"
  constructor(argumentos=[[]]) {
    super(Some.cor, "+", ["...operandos"].map((nome, i) => [nome, argumentos[i]]))
    this.escopo = [
      Nome,
    ]
  }
  avalie(globais) {
    var retorno = ""
    retorno += "(() => {"
    retorno += "var operandos = [];"
    for (var i = 0; i < this.argumentos[0].valor.filhos.length; i++) {
      retorno += "operandos.push(0);"
      retorno += "((chame) => {"
      retorno += this.argumentos[0].valor.filhos[i].avalie(globais)
      retorno += "})((valor) => {"
      retorno += "operandos[" + i + "] = valor;"
      retorno += "chame(operandos.reduce((a, b) => a + b));"
      retorno += "});"
    }
    retorno += "})();"
    return retorno
  }
}

var cor_do_tipo = (tipo) => {
  if (tipo.blocos) {
    return "#d7ab32"
  }
  if (tipo.argumentos) {
    for (var i = 0; i < tipo.argumentos.length; i++) {
      if (tipo.argumentos[i][0] == "nome") {
        return "#ed6d25"
      }
    }
  }
  return {
    "nada": "#97669a",
    "lógico": "#77b940",
    "número": "#3687c7",
    "texto": "#d53571",
    "lista": "#07b7e0",
    "objeto": "#330b9f",
    "cor": "#909090",
    "nome": "#ed6d25",
    "tipo": "#ed6d25",
    "valor": "#ed6d25",
  }[tipo.retorna]
}

export var obtenha = (globais, nome) => {
  var nomes = nome.split(".")
  var objeto = globais[nomes[0]]
  for (var i = 1; i < nomes.length; i++) {
    objeto = objeto.locais[nomes[i]]
  }
  return objeto
}

export var componentes = {
  Aplicativo,
  Texto,
  CampoDeNúmero,
  Some,
  TipoTexto,
  Nome,
}
