import {AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core'
import {PositionsService} from '../../../shared/services/positions.service'
import {Position} from '../../../shared/interfaces'
import {IMaterialInstance, MaterialService} from '../../../shared/classes/material.service'
import {FormControl, FormGroup, Validators} from '@angular/forms'
import {Subscription} from 'rxjs'

@Component({
  selector: 'app-positions-form',
  templateUrl: './positions-form.component.html',
  styleUrls: ['./positions-form.component.scss']
})
export class PositionsFormComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('modal') modalRef: ElementRef
  @Input() categoryId: string

  pSub: Subscription

  modal: IMaterialInstance = null
  form: FormGroup

  positions: Position[]
  positionId: string = null
  loading = true


  constructor(private positionsService: PositionsService) {
  }

  ngOnInit() {
    console.log(this.categoryId)
    this.pSub = this.positionsService.fetch(this.categoryId).subscribe(positions => {
      this.positions = positions
      this.loading = false
    })

    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      // cost: new FormControl(null, [Validators.required, Validators.min(1)])
    })
  }

  ngOnDestroy() {
    if (this.pSub) {
      this.pSub.unsubscribe()
    }
    this.modal.destroy()
  }

  ngAfterViewInit() {
    this.modal = MaterialService.initModal(this.modalRef)
  }

  onSelectPosition(position: Position) {
    this.positionId = position.id
    this.form.patchValue({
      name: position.name
    })
    this.modal.open()
    MaterialService.updateTextInput()
  }

  addPosition() {
    this.positionId = null
    this.form.reset({
      name: null
    })
    this.modal.open()
    MaterialService.updateTextInput()
  }

  removePosition(event, position: Position) {
    event.stopPropagation()
    const decision = window.confirm('Вы уверены, что хотите удалить позицию?')
    if (decision) {
      this.positionsService.remove(position.id).subscribe(
        response => {
          const idx = this.positions.findIndex(p => p.id !== position.id)
          this.positions.splice(idx, 1)
          MaterialService.toast(response.message)
        },
        error => MaterialService.toast(error.error.message)
      )
    }
  }

  onCancel() {
    this.modal.close()
    this.form.reset({name: ''})
  }



  onSubmit() {
    this.form.disable()

    const newPosition: Position = {
      name: this.form.value.name,
      category: this.categoryId
    }

    const completed = () =>
    {
      this.modal.close()
      this.form.reset({name: ''})
      this.form.enable()
    }

    if (this.positionId) {

      newPosition.id = this.positionId
      this.positionsService.update(newPosition).subscribe(
        position => {

          const idx = this.positions.findIndex(p => p.id === position.id)
          this.positions[idx] = position
          MaterialService.toast('Изменения сохранены')

        },
        error => {
          this.form.enable()
          MaterialService.toast(error.error.message)
        },
        completed
      )
    } else {
      // this.positionsService.create(newPosition).subscribe(
      //   position => {
      //     this.positions.push(position)
      //     MaterialService.toast('Изменения сохранены')
      //   },
      //   error => {
      //     this.form.enable()
      //     MaterialService.toast(error.error.message)
      //   },
      //   completed
      // )
    }
  }

}
