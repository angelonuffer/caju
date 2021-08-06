var solicite_escolha = opções => {
  var fundo = document.createElement("div")
  document.body.appendChild(fundo)
  fundo.style.backgroundColor = "#00000088"
  fundo.style.position = "fixed"
  fundo.style.top = 0
  fundo.style.bottom = 0
  fundo.style.left = 0
  fundo.style.right = 0
  fundo.style.zIndex = 10
  fundo.addEventListener("click", () => {
    document.body.removeChild(fundo)
    document.body.removeChild(diálogo)
  })
  var diálogo = document.createElement("div")
  document.body.appendChild(diálogo)
  diálogo.style.backgroundColor = "#FFF"
  diálogo.style.position = "fixed"
  diálogo.style.zIndex = 11
  diálogo.style.left = "50%"
  diálogo.style.top = "50%"
  diálogo.style.transform = "translate(-50%, -50%)"
  diálogo.style.maxHeight = "60%"
  diálogo.style.overflowY = "scroll"
  var coluna_opções = document.createElement("div")
  diálogo.appendChild(coluna_opções)
  coluna_opções.style.margin = 16
  coluna_opções.style.display = "inline-flex"
  coluna_opções.style.flexDirection = "column"
  coluna_opções.style.gap = "8px"
  for (var i = 0; i < opções.length; i++) {
    var opção = document.createElement("div")
    coluna_opções.appendChild(opção)
    opção.style.backgroundColor = opções[i].cor
    opção.style.padding = 16
    opção.style.borderWidth = 3
    opção.style.borderStyle = "solid"
    opção.style.borderColor = "#000"
    var texto = document.createElement("span")
    opção.appendChild(texto)
    texto.textContent = opções[i].nome
    texto.style.fontSize = 24
    texto.style.color = "#fff"
    opção.addEventListener("click", function (escolha) {
      escolha()
      document.body.removeChild(fundo)
      document.body.removeChild(diálogo)
    }.bind(null, opções[i].escolha))
  }
}

export class Comando {
  static selecionado
  static _ao_selecionar = []
  static _ao_desselecionar = []
  static ao_selecionar(chame) {
    Comando._ao_selecionar.push(chame)
  }
  static ao_desselecionar(chame) {
    Comando._ao_desselecionar.push(chame)
  }
  static tipos = []
  static novo(estrutura) {
    return new (Comando.por_nome(estrutura[0]))(...estrutura.slice(1))
  }
  static por_nome(nome) {
    for (var i = 0; i < Comando.tipos.length; i++) {
      if (Comando.tipos[i].nome == nome) {
        return Comando.tipos[i]
      }
    }
  }
  static ao_definir(nome, chame) {
    Comando.tipos.push = function(_push, valor) {
      _push(valor)
      if (valor.nome == nome) {
        chame()
      }
    }.bind(this, Comando.tipos.push.bind(Comando.tipos))
  }
  constructor(argumentos, comandos, comandos_agregados) {
    this.e = document.createElement("div")
    this.e.style.display = "inline-flex"
    this.e.style.flexDirection = "column"
    this.e.style.gap = "2px"
    this.e.tabIndex = 0
    this.e.c = this
    this.carregamento = (async () => {})()
    var linha = document.createElement("div")
    this.e.appendChild(linha)
    linha.style.display = "inline-flex"
    linha.style.flexDirection = "row"
    linha.style.gap = "2px"
    this.identificador = document.createElement("span")
    linha.appendChild(this.identificador)
    this.identificador.style.display = "inline-flex"
    this.identificador.style.padding = 16
    this.identificador.style.backgroundColor = this.constructor.cor
    this.identificador.style.borderStyle = "solid"
    this.identificador.style.borderWidth = 3
    this.identificador.style.borderColor = "#000"
    this.identificador.style.alignItems = "center"
    if (this.constructor.aparência == "padrão") {
      var texto = document.createElement("span")
      this.identificador.appendChild(texto)
      texto.style.fontSize = 24
      texto.style.color = "#fff"
      texto.textContent = this.constructor.nome
    }
    if (this.constructor.aparência == "texto") {
      var texto = document.createElement("span")
      this.identificador.appendChild(texto)
      texto.style.fontSize = 24
      texto.style.color = "#fff"
      texto.textContent = "\""
      this.valor = document.createElement("span")
      this.identificador.appendChild(this.valor)
      this.valor.contentEditable = true
      this.valor.style.minWidth = "48px"
      this.valor.style.fontSize = 24
      this.valor.style.color = "#fff"
      if (argumentos !== undefined) {
        this.valor.textContent = argumentos
      }
      var texto = document.createElement("span")
      this.identificador.appendChild(texto)
      texto.style.fontSize = 24
      texto.style.color = "#fff"
      texto.textContent = "\""
    }
    if (this.constructor.aparência == "código") {
      var div = document.createElement("div")
      this.identificador.appendChild(div)
      div.style.width = 600
      this.editor = ace.edit(div, {
        minLines: 1,
        maxLines: 8,
      })
      if (argumentos !== undefined) {
        this.editor.setValue(argumentos)
        this.editor.clearSelection()
      }
    }
    if (this.constructor.aparência == "número") {
      this.valor = document.createElement("input")
      this.identificador.appendChild(this.valor)
      this.valor.type = "number"
      this.valor.style.fontSize = 24
      if (argumentos !== undefined) {
        this.valor.value = argumentos
      }
    }
    if (this.constructor.aparência == "nome") {
      this.valor = document.createElement("span")
      this.identificador.appendChild(this.valor)
      this.valor.contentEditable = true
      this.valor.style.minWidth = "48px"
      this.valor.style.fontSize = 24
      this.valor.style.color = "#fff"
      if (argumentos !== undefined) {
        this.valor.textContent = argumentos
      }
    }
    if (this.constructor.aparência == "agregado") {
      var texto = document.createElement("span")
      this.identificador.appendChild(texto)
      texto.style.fontSize = 24
      texto.style.color = "#fff"
      texto.textContent = this.constructor.nome
    }
    this.argumentos = {}
    var grade_argumentos = document.createElement("div")
    linha.appendChild(grade_argumentos)
    grade_argumentos.style.display = "inline-grid"
    grade_argumentos.style.gridTemplateColumns = "auto auto"
    grade_argumentos.style.columnGap = "2px"
    if (this.constructor.argumentos !== undefined) {
      for (var i = 0; i < this.constructor.argumentos.length; i++) {
        var argumento = {}
        this.argumentos[this.constructor.argumentos[i].nome] = argumento
        if (this.constructor.argumentos.length > 1) {
          argumento.identificador = document.createElement("div")
          grade_argumentos.appendChild(argumento.identificador)
          argumento.identificador.style.display = "none"
          argumento.identificador.style.justifyContent = "flex-end"
          argumento.identificador.style.padding = 16
          argumento.identificador.style.backgroundColor = this.constructor.cor
          argumento.identificador.style.borderStyle = "solid"
          argumento.identificador.style.borderWidth = 3
          argumento.identificador.style.borderColor = "#000"
          argumento.identificador.style.alignItems = "center"
          argumento.identificador.style.borderLeftWidth = 0
          grade_argumentos.style.marginLeft = -2
          var texto = document.createElement("span")
          argumento.identificador.appendChild(texto)
          texto.style.fontSize = 24
          texto.style.color = "#fff"
          texto.textContent = this.constructor.argumentos[i].nome
        }
        argumento.linha = document.createElement("div")
        grade_argumentos.appendChild(argumento.linha)
        argumento.linha.style.display = "inline-flex"
        argumento.linha.style.flexDirection = "row"
        argumento.linha.style.gap = "2px"
        if (i > 0) {
          argumento.linha.style.marginTop = 1
          argumento.identificador.style.borderTopWidth = 0
        }
        if (i < this.constructor.argumentos.length - 1) {
          argumento.linha.style.marginBottom = 1
          argumento.identificador.style.borderBottomWidth = 0
        }
        argumento.definir = document.createElement("div")
        argumento.linha.appendChild(argumento.definir)
        argumento.definir.style.backgroundColor = this.constructor.argumentos[i].cor
        argumento.definir.style.padding = 16
        argumento.definir.style.borderStyle = "solid"
        argumento.definir.style.borderWidth = 3
        argumento.definir.style.borderColor = "#000"
        argumento.definir.style.alignItems = "center"
        argumento.definir.style.display = "none"
        var ícone = document.createElement("span")
        argumento.definir.appendChild(ícone)
        ícone.classList.add("mdi")
        ícone.style.fontSize = "24px"
        ícone.style.color = "#fff"
        if (this.constructor.argumentos[i].nome.startsWith("...")) {
          ícone.classList.add("mdi-plus-circle-outline")
          argumento.valor = document.createElement("div")
          argumento.linha.appendChild(argumento.valor)
        } else {
          ícone.classList.add("mdi-chevron-left-circle-outline")
        }
        argumento.definir.addEventListener("click", function (i) {
          this.constructor.argumentos[i].solicite_definição(comando => {
            var argumento = this.argumentos[this.constructor.argumentos[i].nome]
            if (this.constructor.argumentos[i].nome.startsWith("...")) {
              argumento.valor.appendChild(comando.e)
            } else {
              argumento.linha.appendChild(comando.e)
              argumento.valor = comando
            }
            this.selecione()
            this.desselecione()
          })
        }.bind(this, i))
        if (argumentos !== undefined) {
          if (argumentos[i] !== null) {
            if (this.constructor.argumentos[i].nome.startsWith("...")) {
              argumentos[i].map(_argumento => {
                argumento.valor.appendChild(Comando.novo(_argumento).e)
              })
            } else {
              argumento.valor = Comando.novo(argumentos[i])
              argumento.linha.appendChild(argumento.valor.e)
            }
            this.selecione()
            this.desselecione()
          }
        }
      }
    }
    if (this.constructor.aceita !== undefined) {
      this.e.style.alignItems = "flex-start"
      this.bloco = {}
      this.bloco.linha = document.createElement("div")
      this.bloco.linha.style.display = "inline-flex"
      this.bloco.linha.style.flexDirection = "row"
      this.bloco.linha.style.gap = "2px"
      this.bloco.indentação = document.createElement("div")
      this.bloco.indentação.style.padding = 8
      this.bloco.indentação.style.borderStyle = "solid"
      this.bloco.indentação.style.borderWidth = 0
      this.bloco.indentação.style.borderColor = "#000"
      this.bloco.indentação.style.backgroundColor = this.constructor.cor
      this.bloco.indentação.style.marginTop = -5
      this.bloco.indentação.style.marginBottom = -5
      this.bloco.indentação.style.borderLeftWidth = 3
      this.bloco.indentação.style.borderRightWidth = 3
      this.bloco.indentação.style.zIndex = 1
      this.bloco.linha.appendChild(this.bloco.indentação)
      this.bloco.coluna = document.createElement("div")
      this.bloco.coluna.style.display = "inline-flex"
      this.bloco.coluna.style.flexDirection = "column"
      this.bloco.coluna.style.gap = "2px"
      this.bloco.coluna.style.alignItems = "flex-start"
      this.bloco.linha.appendChild(this.bloco.coluna)
      this.bloco.linha.style.display = "none"
      this.e.appendChild(this.bloco.linha)
      this.fim = document.createElement("div")
      this.fim.style.padding = 8
      this.fim.style.borderStyle = "solid"
      this.fim.style.borderWidth = 3
      this.fim.style.borderColor = "#000"
      this.fim.style.backgroundColor = this.constructor.cor
      this.fim.style.width = 64
      this.fim.style.display = "none"
      this.e.appendChild(this.fim)
      if (comandos !== undefined) {
        if (comandos.length > 0) {
          comandos.map(comando => this.bloco.coluna.appendChild(Comando.novo(comando).e))
          this.bloco.linha.style.display = "inline-flex"
          this.fim.style.display = "block"
        }
      }
    }
    this.comandos_agregados = []
    if (comandos_agregados !== undefined) {
      comandos_agregados.map(estrutura => this.inclua_comando(Comando.novo(estrutura)))
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
    this.identificador.style.borderColor = "#ff9800"
    if (this.constructor.argumentos !== undefined) {
      this.constructor.argumentos.map((definição_do_argumento, i) => {
        var argumento = this.argumentos[definição_do_argumento.nome]
        if (argumento !== undefined) {
          if (argumento.identificador !== undefined) {
            argumento.identificador.style.display = "inline-flex"
            argumento.identificador.style.borderColor = "#ff9800"
            this.identificador.style.borderRightWidth = 0
          }
          argumento.definir.style.display = "block"
          argumento.linha.style.display = "inline-flex"
          if (i > 0) {
            argumento.identificador.style.borderTopWidth = 0
          }
          if (i < this.constructor.argumentos.length - 1) {
            argumento.identificador.style.borderBottomWidth = 0
          }
        }
      })
    }
    if (this.bloco) {
      this.bloco.indentação.style.borderColor = "#ff9800"
      this.fim.style.borderColor = "#ff9800"
    }
  }
  desselecione() {
    Comando._ao_desselecionar.map(c => c())
    this.identificador.style.borderColor = "#000"
    this.identificador.style.borderRightWidth = 3
    if (this.constructor.argumentos !== undefined) {
      var último_argumento_definido
      this.constructor.argumentos.map(definição_do_argumento => {
        var argumento = this.argumentos[definição_do_argumento.nome]
        if (argumento !== undefined) {
          if (argumento.identificador !== undefined) {
            var argumento_definido = false
            if (argumento.valor !== undefined) {
              if (definição_do_argumento.nome.startsWith("...")) {
                if (argumento.valor.children.length > 0) {
                  argumento_definido = true
                }
              } else {
                argumento_definido = true
              }
            }
            if (argumento_definido) {
              this.identificador.style.borderRightWidth = 0
              if (último_argumento_definido == undefined) {
                argumento.identificador.style.borderTopWidth = 3
              }
              último_argumento_definido = argumento
              argumento.linha.style.display = "inline-flex"
            } else {
              argumento.identificador.style.display = "none"
              argumento.linha.style.display = "none"
            }
            argumento.identificador.style.borderColor = "#000"
          }
          if (argumento.valor !== undefined) {
            argumento.definir.style.display = "none"
          } else {
            argumento.linha.style.display = "none"
          }
        }
      })
      if (último_argumento_definido !== undefined) {
        último_argumento_definido.identificador.style.borderBottomWidth = 3
      }
    }
    if (this.bloco) {
      this.bloco.indentação.style.borderColor = "#000"
      this.fim.style.borderColor = "#000"
    }
  }
  estruture() {
    var estrutura = [this.constructor.nome]
    if (this.constructor.aparência == "texto") {
      return [...estrutura, this.valor.textContent]
    }
    if (this.constructor.aparência == "código") {
      return [...estrutura, this.editor.getValue()]
    }
    if (this.constructor.aparência == "número") {
      return [...estrutura, this.valor.value]
    }
    if (this.constructor.aparência == "nome") {
      return [...estrutura, this.valor.textContent]
    }
    var estrutura = [this.constructor.nome]
    if (this.constructor.argumentos !== undefined) {
      estrutura.push(this.constructor.argumentos.map(definição_do_argumento => {
        var argumento = this.argumentos[definição_do_argumento.nome]
        if (definição_do_argumento.nome.startsWith("...")) {
          return [...argumento.valor.children].map(argumento => argumento.c.estruture())
        }
        if (argumento.valor === undefined) {
          return null
        }
        return argumento.valor.estruture()
      }))
    } else {
      estrutura.push([])
    }
    if (this.constructor.aceita !== undefined) {
      estrutura.push([...this.bloco.coluna.children].map(comando => comando.c.estruture()))
    } else {
      estrutura.push([])
    }
    estrutura.push(this.comandos_agregados.map(comando => comando.estruture()))
    return estrutura
  }
  solicite_inclusão_de_comando() {
    solicite_escolha(Comando.tipos.filter(Tipo => this.constructor.aceita.indexOf(Tipo.retorna) > -1).map(Tipo => {
      return {
        cor: Tipo.cor,
        nome: Tipo.nome,
        escolha: () => this.inclua_comando(new Tipo()),
      }
    }))
  }
  inclua_comando(comando) {
    if (comando.constructor.aparência == "agregado") {
      this.e.appendChild(comando.e)
      this.e.appendChild(this.fim)
      this.comandos_agregados.push(comando)
      return
    }
    this.bloco.coluna.appendChild(comando.e)
    this.bloco.linha.style.display = "inline-flex"
    if (this.constructor.aparência !== "agregado") {
      this.fim.style.display = "block"
    }
  }
}

class Argumento {
  constructor(cor, nome, aceita) {
    this.cor = cor
    this.nome = nome
    this.aceita = aceita
  }
  solicite_definição(chame) {
    solicite_escolha(Comando.tipos.filter(Tipo => this.aceita.indexOf(Tipo.retorna) > -1).map(Tipo => {
      return {
        cor: Tipo.cor,
        nome: Tipo.nome,
        escolha: () => chame(new Tipo()),
      }
    }))
  }
}

class ArgumentoComOpções {
  constructor(cor, nome, opções) {
    this.cor = cor
    this.nome = nome
    this.opções = opções
  }
  solicite_definição(chame) {
    solicite_escolha(this.opções.map(opção => {
      return {
        cor: "#330b9f",
        nome: opção,
        escolha: () => {
          var comando = Comando.novo(["caju.opção", opção])
          chame(comando)
        },
      }
    }))
  }
}

Comando.tipos.push(class extends Comando {
  static cor = "#330b9f"
  static nome = "caju.opção"
  constructor(valor) {
    super()
    this.valor = document.createElement("span")
    this.identificador.appendChild(this.valor)
    this.valor.style.minWidth = "48px"
    this.valor.style.fontSize = 24
    this.valor.style.color = "#fff"
    this.valor.textContent = valor
  }
  estruture() {
    return [this.constructor.nome, this.valor.textContent]
  }
  avalie() {
    return this.valor.textContent
  }
})

Comando.tipos.push(class extends Comando {
  static cor = "#d53571"
  static nome = "caju.texto"
  static retorna = "caju.texto"
  static aparência = "texto"
  avalie(globais) {
    return this.valor.textContent
  }
})

Comando.tipos.push(class extends Comando {
  static cor = "#97669a"
  static nome = "caju.importe"
  static retorna = "caju.global"
  static aparência = "padrão"
  static argumentos = [
    new Argumento(
      "#d53571",
      "endereço",
      [
        "caju.texto",
      ],
    ),
  ]
  static módulos = {}
  static ao_importar = {}
  constructor(argumentos) {
    super(argumentos)
    this.carregamento = (async () => {
      var resposta = await fetch(this.argumentos["endereço"].valor.avalie())
      var conteúdo = await resposta.json()
      conteúdo.slice(1).map(objeto => {
        return Comando.novo(objeto)
      })
    })()
  }
  avalie(globais) {
  }
})

Comando.tipos.push(class extends Comando {
  static cor = "#d7ab32"
  static nome = "caju.comando.estende"
  static aparência = "agregado"
  static aceita = "caju.texto"
})

Comando.tipos.push(class extends Comando {
  static cor = "#d7ab32"
  static nome = "caju.comando.argumentos"
  static aparência = "agregado"
  static aceita = "caju.argumento"
})

Comando.tipos.push(class extends Comando {
  static cor = "#d7ab32"
  static nome = "caju.comando.aceita"
  static aparência = "agregado"
  static aceita = "caju.texto"
})

Comando.tipos.push(class extends Comando {
  static cor = "#d7ab32"
  static nome = "caju.comando"
  static retorna = "caju.global"
  static aparência = "padrão"
  static argumentos = [
    new Argumento(
      "#909090",
      "cor",
      [
        "caju.texto",
        "caju.cor",
      ],
    ),
    new Argumento(
      "#d53571",
      "nome",
      [
        "caju.texto",
      ],
    ),
    new Argumento(
      "#d53571",
      "retorna",
      [
        "caju.texto",
      ],
    ),
    new ArgumentoComOpções(
      "#330b9f",
      "aparência",
      [
        "padrão",
        "texto",
        "número",
        "código",
        "nome",
        "agregado",
      ],
    ),
  ]
  static aceita = ["caju.interno"]
  constructor(argumentos, comandos, comandos_agregados) {
    if (comandos_agregados === undefined) {
      comandos_agregados = [
        ["caju.comando.estende"],
        ["caju.comando.argumentos"],
        ["caju.comando.aceita"],
      ]
    }
    super(argumentos, comandos, comandos_agregados)
    var that = this
    this.Tipo = class extends Comando {
      constructor(argumentos, comandos) {
        that.Tipo.argumentos = [...that.comandos_agregados[1].bloco.coluna.children].map(filho => {
          return new Argumento(
            filho.c.argumentos.cor.valor.avalie(),
            filho.c.argumentos.nome.valor.avalie(),
            [...filho.c.argumentos["...aceita"].valor.children].map(filho => filho.c.avalie()),
          )
        })
        that.Tipo.aceita = [...that.comandos_agregados[2].bloco.coluna.children].map(filho => filho.c.avalie()),
        super(argumentos, comandos)
      }
      avalie(globais, objeto_superior) {
        that.chame(globais, this, objeto_superior)
      }
    }
    this.constructor.argumentos.map(function (argumento) {
      if (! argumento.nome.startsWith("...")) {
        var linha = this.argumentos[argumento.nome].linha
        linha.appendChild = function(_appendChild, argumento, filho) {
          filho.c.valor.addEventListener("input", function(argumento, filho) {
            this.Tipo[argumento.nome] = filho.c.avalie()
          }.bind(this, argumento, filho))
          this.Tipo[argumento.nome] = filho.c.avalie()
          return _appendChild(filho)
        }.bind(this, linha.appendChild.bind(linha), argumento)
        if (this.argumentos[argumento.nome].valor !== undefined) {
          this.Tipo[argumento.nome] = this.argumentos[argumento.nome].valor.avalie()
        }
      }
    }.bind(this))
    Comando.tipos.push(this.Tipo)
  }
  chame(globais, objeto, objeto_superior) {
    [...this.bloco.coluna.children].map(comando => {
      comando.c.avalie(globais, objeto, objeto_superior)
    })
  }
  avalie() {}
})

Comando.tipos.push(class extends Comando {
  static cor = "#330b9f"
  static nome = "caju.argumento"
  static retorna = "caju.argumento"
  static aparência = "padrão"
  static argumentos = [
    new Argumento(
      "#909090",
      "cor",
      [
        "caju.texto",
        "caju.cor",
      ],
    ),
    new Argumento(
      "#d53571",
      "nome",
      [
        "caju.texto",
      ],
    ),
    new Argumento(
      "#d53571",
      "...aceita",
      [
        "caju.texto",
      ],
    ),
  ]
})

Comando.tipos.push(class extends Comando {
  static cor = "#97669a"
  static nome = "caju.escreva_valor"
  static retorna = "caju.interno"
  static aparência = "padrão"
  avalie(globais, objeto) {
    if (objeto.constructor.aparência == "texto") {
      globais["caju.saída"] += objeto.valor.textContent
    }
    if (objeto.constructor.aparência == "número") {
      globais["caju.saída"] += objeto.valor.value
    }
    if (objeto.constructor.aparência == "nome") {
      globais["caju.saída"] += objeto.valor.textContent
    }
  }
})

Comando.tipos.push(class extends Comando {
  static cor = "#97669a"
  static nome = "caju.avalie_argumento"
  static retorna = "caju.interno"
  static aparência = "padrão"
  static argumentos = [
    new Argumento(
      "#d53571",
      "nome",
      [
        "caju.texto",
      ],
    ),
  ]
  avalie(globais, objeto) {
    Object.keys(objeto.argumentos).map(nome_argumento => {
      if (nome_argumento == this.argumentos.nome.valor.avalie()) {
        objeto.argumentos[nome_argumento].valor.avalie(globais, objeto)
      }
    })
  }
})

Comando.tipos.push(class extends Comando {
  static cor = "#97669a"
  static nome = "caju.avalie_bloco"
  static retorna = "caju.interno"
  static aparência = "padrão"
  avalie(globais, objeto) {
    [...objeto.bloco.coluna.children].map(comando => {
      comando.c.avalie(globais)
    })
  }
})

Comando.tipos.push(class extends Comando {
  static cor = "#97669a"
  static nome = "caju.escreva"
  static retorna = "caju.interno"
  static aparência = "código"
  avalie(globais, objeto) {
    globais["caju.saída"] += this.editor.getValue()
  }
})

Comando.tipos.push(class extends Comando {
  static cor = "#d7ab32"
  static nome = "caju.escopo_superior"
  static retorna = "caju.interno"
  static aparência = "padrão"
  static argumentos = [
    new Argumento(
      "#d53571",
      "argumento",
      [
        "caju.texto",
      ],
    ),
  ]
  static aceita = ["caju.interno"]
  avalie(globais, objeto, objeto_superior) {
    var valor_argumento_1 = this.argumentos["argumento"].valor
    if (valor_argumento_1 !== undefined) {
      var valor_argumento_2 = objeto.argumentos[valor_argumento_1.avalie(globais)].valor
      if (valor_argumento_2 !== undefined) {
        var valor_argumento_3 = objeto_superior.argumentos[valor_argumento_2.avalie(globais)].valor
        if (valor_argumento_3 !== undefined) {
          var argumento = objeto_superior.argumentos[valor_argumento_1.avalie(globais)]
          objeto_superior.argumentos[valor_argumento_1.avalie(globais)] = {
            valor: {
              avalie: (globais, objeto) => valor_argumento_3.avalie(globais, objeto)
            }
          }
          ;[...this.bloco.coluna.children].map(comando => {
            comando.c.avalie(globais, objeto_superior)
          })
          objeto_superior.argumentos[valor_argumento_1.avalie(globais)] = argumento
        }
      }
    }
  }
})

Comando.tipos.push(class extends Comando {
  static cor = "#d7ab32"
  static nome = "caju.comandos_que_retornam"
  static retorna = "caju.interno"
  static aparência = "padrão"
  static argumentos = [
    new Argumento(
      "#d53571",
      "...aceita",
      [
        "caju.texto",
      ],
    ),
  ]
  static aceita = []
  avalie(globais, objeto, objeto_superior) {
    [...this.bloco.coluna.children].map(comando => {
      comando.c.avalie(globais, objeto)
    })
  }
  solicite_inclusão_de_comando() {
    var aceita = [...this.argumentos["...aceita"].valor.children].map(comando => comando.c.avalie())
    solicite_escolha(Comando.tipos.filter(Tipo => aceita.indexOf(Tipo.retorna) > -1).map(Tipo => {
      return {
        cor: Tipo.cor,
        nome: Tipo.nome,
        escolha: () => this.inclua_comando(new Tipo()),
      }
    }))
  }
})
