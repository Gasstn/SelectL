class SelectL{
	#html
	#aspectos

	constructor(aspectos){
		if(aspectos != null){
			this.#aspectos = aspectos;
			this.#gen_selectl();
			this.#caracteristicas_variables();
			

			/*seteando meta aspectos por defecto */
			if(this.#aspectos.placeholder != null)
				/* colocando valor */
				this.#html.querySelector('#selectl_barra #selectl_opcion_elegida #selectl_label_opcion_elegida').innerHTML = this.#aspectos.placeholder;
			else{
				let selectl_opciones = this.#html.querySelector('#selectl_opciones');
				let opcion_defecto = selectl_opciones.querySelector('div:not(#searcher)');

				let label_opcion_elegida_por_defecto = "", value_opcion_elegida_por_defecto = "";
				if(opcion_defecto != null){
					label_opcion_elegida_por_defecto = opcion_defecto.querySelector("#label_opcion").innerHTML;
					value_opcion_elegida_por_defecto = opcion_defecto.dataset["value"];
					opcion_defecto = selectl_opciones.querySelector('div#selected:not(#searcher)');
					if(opcion_defecto != null){
						label_opcion_elegida_por_defecto = opcion_defecto.querySelector("#label_opcion").innerHTML;
						value_opcion_elegida_por_defecto = opcion_defecto.dataset["value"];
					}
				}

				/* colocando valores */
				this.#html.querySelector('#selectl_barra #selectl_opcion_elegida #selectl_label_opcion_elegida').innerHTML = label_opcion_elegida_por_defecto;
				this.#html.querySelector('#selectl_barra #selectl_opcion_elegida input').value = value_opcion_elegida_por_defecto;
			}
		}
	}

	/* metodos para editar aspectos post-constructor */
	push_opciones(opciones){
		if(!Array.isArray(opciones))
			opciones = [opciones];

		opciones.forEach(opcion => {
			this.#aspectos.opciones.push(opcion);
			
			if(opcion.id == "selected" && this.#html.querySelector("#selectl_opciones div:not(#searcher)#selected") == null){
				this.#html.querySelector('#selectl_barra #selectl_opcion_elegida #selectl_label_opcion_elegida').innerHTML = opcion.label;
				this.#html.querySelector('#selectl_barra #selectl_opcion_elegida input').value = opcion.value;
			}
		});

		this.#push_opciones(opciones);
	}
	change_styleclass(clase){
		this.#aspectos.styleclass = "selectl " + clase;
		this.#html.classList = "selectl " + clase;
	}
	change_name(name){
		this.#aspectos.name = name;
		
		this.#html.querySelector('#selectl_barra #selectl_opcion_elegida input[type="hidden"]').name = name;
		this.#html.id = name;
	}
	change_placeholder(placeholder){
		this.#aspectos.placeholder = placeholder;
	}
	change_dif_upper_lower_case(dif_upper_lower_case){
		this.#aspectos.dif_upper_lower_case = dif_upper_lower_case;
	}
	change_dif_accent(dif_accent){
		this.#aspectos.dif_accent = dif_accent;
	}
	change_searcher(searcher){
		if(this.#html.querySelector("#selectl_opciones div#searcher") == null){
			if(searcher){// pregunto si hay que poner el searcher
				let div_searcher = document.createElement("div"); // div contenedor del searcher
				div_searcher.id = "searcher";

				let input_searcher = document.createElement("input");// searcher
				input_searcher.type = "search";

				/* codigo para searcher */
				
				input_searcher.addEventListener("input", () => {
					this.#html.querySelectorAll('#selectl_opciones > div:not(#searcher)').forEach(opcion => {
						let queda;
						if(!this.#aspectos.dif_upper_lower_case)
							if(!this.#aspectos.dif_accent)
								queda = opcion.innerHTML.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(input_searcher.value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase());
							else
								queda = opcion.innerHTML.toLowerCase().includes(input_searcher.value.toLowerCase());
						else
							if(!this.#aspectos.dif_accent)
								queda = opcion.innerHTML.normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(input_searcher.value.normalize("NFD").replace(/[\u0300-\u036f]/g, ""));
							else
								queda = opcion.innerHTML.includes(input_searcher.value);
						if(queda)
							opcion.style.display = "block";
						else
							opcion.style.display = "none";
					});
				});
				div_searcher.appendChild(input_searcher);

				this.#html.querySelector('#selectl_opciones').insertAdjacentElement("afterbegin", div_searcher);
			}
		}else
			if(!searcher)
				this.#html.querySelector('#selectl_opciones').removeChild(this.#html.querySelector("#selectl_opciones div#searcher"));
	}

	/* getters */
	get html(){
		return this.#html;
	}
	get aspectos(){
		return this.#aspectos;
	}

	/* metodos para constructor */
	#push_opciones(opciones){
		let label_opcion_elegida = this.#html.querySelector('#selectl_barra #selectl_opcion_elegida #selectl_label_opcion_elegida');
		let input_value_opcion_elegida = this.#html.querySelector('#selectl_barra #selectl_opcion_elegida input');
		let selectl_opciones = this.#html.querySelector('#selectl_opciones');

		if(!Array.isArray(opciones))
			opciones = [opciones];
		
		const SEPARACION_CON_BOTON = 4;
		let mayor = 0;// mayor length de los elementos de las opciones (o placeholder en caso de que este seteado)
		if(this.#html.style.width != "")
			mayor = parseInt(this.#html.style.width.substr(0, this.#html.style.width.length - 2)) - SEPARACION_CON_BOTON;
		else
			if(this.#aspectos.placeholder != null)
				mayor = this.#aspectos.placeholder.length;

		opciones.forEach(opcion =>{
			let div_opcion = document.createElement("div");
				let div_label_opcion = document.createElement("div");
				let div_subtit_opcion = document.createElement("div");
				let div_metdat_opcion = document.createElement("div");
			
			/* LABEL */
			div_label_opcion.innerHTML = opcion.label;
			div_label_opcion.id = "label_opcion";
			
			/* SUBTIT */
			if(opcion.subtit != null)
				div_subtit_opcion.innerHTML = opcion.subtit;
			else
				div_subtit_opcion.style.display = "none";
			div_subtit_opcion.id = "subtit_opcion";

			/* META DATOS */
			if(opcion.metdat != null)
				div_metdat_opcion.innerHTML = opcion.metdat;
			else
				div_metdat_opcion.style.display = "none";
			div_metdat_opcion.id = "metdat_opcion";

			/* COLOR */
			if(opcion.color != null)
				div_opcion.style.background = opcion.color;

			/* agregando partes de la opcion al div_opcion */
			div_opcion.appendChild(div_subtit_opcion);
			div_opcion.appendChild(div_label_opcion);
			div_opcion.appendChild(div_metdat_opcion);
			
			/* value del div_opcion */
			div_opcion.dataset["value"] = opcion.value;

			/* agregando clases y id al div_opcion */
			if(opcion.classList != null)
				div_opcion.classList = opcion.classList;
			if(opcion.id != null)
				div_opcion.id = opcion.id;

			/* click en el option */
			div_opcion.addEventListener("click", evento => {	
				label_opcion_elegida.innerHTML = opcion.label;
				input_value_opcion_elegida.value = opcion.value;
				input_value_opcion_elegida.dispatchEvent((new Event("change")));// dispara el evento change en el input dentro del selectl (ya que al ser el valor cambiado por js no se dispara el evento naturalmente y se lo debe de inducir)
				this.#html.querySelector('#selectl_barra').click();
			});

			/* agregando div_opcion a la lista de opciones */
			selectl_opciones.appendChild(div_opcion);

			if(mayor < opcion.label.length)// para encontrar la longitud maxima asi definir la longitud del selectl final por defecto
				mayor = opcion.label.length;
		});

		/* seteando nuevo tamaño selectl */
		this.#html.style.width = (mayor + SEPARACION_CON_BOTON) + "ch";
	}

		/* generador de selectl standar */
	#gen_selectl(){
		this.#html = document.createElement("div");// div principal del selectl
			let selectl_barra = document.createElement("div");// barra del selectl
				let div_datos_opcion_elegida = document.createElement("div");// div contenedor de los datos de la opcion que se eligio (label, value)
					let label_opcion_elegida = document.createElement("div");// div contenedor del label de la opcion elegida
					let input_value_opcion_elegida = document.createElement("input");// input hidden contenedor del value de la opcion elegida
				let div_btn_desplegar_opciones = document.createElement("div");// boton de felchita para desplegar las opciones
			let selectl_opciones = document.createElement("div");// div contenedor de las opciones
	
		div_datos_opcion_elegida.id = "selectl_opcion_elegida";

		label_opcion_elegida.id = "selectl_label_opcion_elegida";
		div_datos_opcion_elegida.appendChild(label_opcion_elegida);

		input_value_opcion_elegida.type = "hidden";
		div_datos_opcion_elegida.appendChild(input_value_opcion_elegida);
	
		selectl_barra.appendChild(div_datos_opcion_elegida);

		div_btn_desplegar_opciones.id = "selectl_btn_desplegar_opciones";
		div_btn_desplegar_opciones.innerHTML = "&#5167;";
		selectl_barra.appendChild(div_btn_desplegar_opciones);

		/* click para desplegar o plegar opciones */
		selectl_barra.addEventListener("click", () => {
			if(selectl_opciones.style.display == "none")
				selectl_opciones.style.display = "block";
			else
				selectl_opciones.style.display = "none";
		});
		selectl_barra.id = "selectl_barra";
		this.#html.appendChild(selectl_barra);

		selectl_opciones.id = "selectl_opciones";
		selectl_opciones.style.display = "none";

		this.#html.appendChild(selectl_opciones);
	
		this.#html.classList = "selectl";
	}

		/* agregado de caracteristicas variables */
	#caracteristicas_variables(){
		/* seteando nombre del selectl */
		this.change_name(this.#aspectos.name);

		/* caracteristicas de opciones */
			/* estilos de selectl */
		if(this.#aspectos.styleclass != null)
			this.change_styleclass(this.#aspectos.styleclass);

			/* searcher */
		this.change_searcher(this.#aspectos.searcher);

			/* seteando opciones */
		this.#push_opciones(this.#aspectos.opciones);

		if(this.#aspectos.width != null)
			this.#html.style.width = this.#aspectos.width;
	}
}
