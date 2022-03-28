import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import 'moment/locale/es';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  

  createFormGroup(){
    return new FormGroup({
      email: new FormControl(''),
      name: new FormControl('',[Validators.minLength(4)]),
      lastname: new FormControl('', Validators.required),
      message: new FormControl(''),
      select: new FormControl('', Validators.required)
    })
  }

  contactForm!: FormGroup;

  constructor() {
    this.contactForm = this.createFormGroup()
  }

  ngOnInit(): void {
    
    var year = 2022
    var month = 11
    moment.locale('es');
    console.log(moment.locale())
    var momentSinUTC = moment(`${year}/${month}/01`).format("D MMMM YYYY");
    console.log(momentSinUTC)

  }

  onResetForm(){
    this.contactForm.reset()
  }

  onSaveForm(){
    console.log(this.contactForm.value.name)
  }

  

  get name(){ return this.contactForm.get('name')}
  get lastname(){ return this.contactForm.get('lastname')}
  get select(){ return this.contactForm.get('select')}

}
