
import { Component } from '@angular/core';
import { ConexionApiService } from '../conexion-api.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent {
  clearFiles() {
    this.formDataFields.forEach(f => { if (f.isFile) f.file = undefined; });
  }
  // ...existing code...
  // ...existing code...
  peticion = 'GET';
  url = '';
  body = '';
  validJSON = true;
  resultado = '';
  cargando = false;
  metodos = ['GET', 'POST', 'PUT', 'DELETE'];
  headers: {key: string, value: string}[] = [];
  bodyType: 'json' | 'formdata' = 'json';
  formDataFields: {key: string, value?: string, file?: File, isFile?: boolean}[] = [];
  addFormDataField() {
    this.formDataFields.push({key: '', value: '', isFile: false});
  }

  removeFormDataField(i: number) {
    this.formDataFields.splice(i, 1);
  }

  onFileChange(event: any, i: number) {
    const file = event.target.files[0];
    if (file) {
      this.formDataFields[i].file = file;
      this.formDataFields[i].value = undefined;
    }
  }


  constructor(private con: ConexionApiService) {
    this.cargarConfig();
  }

  validarJSON() {
    if (!this.body.trim()) {
      this.validJSON = true;
      return;
    }
    try {
      JSON.parse(this.body);
      this.validJSON = true;
    } catch {
      this.validJSON = false;
    }
  }

  construirURL(): string {
    let url = this.url.trim();
    if (!/^https?:\/\//i.test(url)) {
      url = 'http://' + url;
    }
    return url;
  }

  getHeadersObj(): any {
    const obj: any = {};
    this.headers.forEach(h => {
      if (h.key) obj[h.key] = h.value;
    });
    return Object.keys(obj).length ? obj : undefined;
  }

  enviarPeticion() {
    this.resultado = '';
    this.cargando = true;
    const url = this.construirURL();
    const headers = this.getHeadersObj();
    this.guardarConfig();

    let bodyToSend: any = null;
    if (this.bodyType === 'formdata') {
      bodyToSend = new FormData();
      this.formDataFields.forEach(f => {
        if (f.key) {
          if (f.isFile && f.file) {
            bodyToSend.append(f.key, f.file);
          } else if (f.value !== undefined) {
            bodyToSend.append(f.key, f.value);
          }
        }
      });
    } else {
      if (this.validJSON) {
        bodyToSend = JSON.parse(this.body);
      }
    }

    switch (this.peticion) {
      case 'GET':
        this.con.petGET(url, headers).subscribe(
          res => this.mostrarResultado(res),
          err => this.mostrarResultado(err)
        );
        break;
      case 'POST':
        if (this.bodyType === 'formdata') {
          this.con.petPOST(url, bodyToSend, headers).subscribe(
            res => this.mostrarResultado(res),
            err => this.mostrarResultado(err)
          );
        } else if (this.validJSON) {
          this.con.petPOST(url, bodyToSend, headers).subscribe(
            res => this.mostrarResultado(res),
            err => this.mostrarResultado(err)
          );
        }
        break;
      case 'PUT':
        if (this.bodyType === 'formdata') {
          this.con.petPUT(url, bodyToSend, headers).subscribe(
            res => this.mostrarResultado(res),
            err => this.mostrarResultado(err)
          );
        } else if (this.validJSON) {
          this.con.petPUT(url, bodyToSend, headers).subscribe(
            res => this.mostrarResultado(res),
            err => this.mostrarResultado(err)
          );
        }
        break;
      case 'DELETE':
        this.con.petDELETE(url, headers).subscribe(
          res => this.mostrarResultado(res),
          err => this.mostrarResultado(err)
        );
        break;
    }
  }

  mostrarResultado(res: any) {
    this.cargando = false;
    this.resultado = JSON.stringify(res, null, 2);
  }

  agregarHeader() {
    this.headers.push({key: '', value: ''});
  }

  eliminarHeader(i: number) {
    this.headers.splice(i, 1);
  }

  guardarConfig() {
    const config = {
      peticion: this.peticion,
      url: this.url,
      body: this.body,
      headers: this.headers,
      bodyType: this.bodyType,
      formDataFields: this.formDataFields
    };
    localStorage.setItem('apitest_config', JSON.stringify(config));
  }

  cargarConfig() {
    const config = localStorage.getItem('apitest_config');
    if (config) {
      const obj = JSON.parse(config);
      this.peticion = obj.peticion || 'GET';
      this.url = obj.url || '';
      this.body = obj.body || '';
      this.headers = obj.headers || [];
      this.bodyType = obj.bodyType || 'json';
      this.formDataFields = obj.formDataFields || [];
    }
  }
  beautifyBody() {
    try {
      const obj = JSON.parse(this.body || '');
      this.body = JSON.stringify(obj, null, 2);
      this.validJSON = true;
    } catch {
      this.validJSON = false;
    }
  }
}
