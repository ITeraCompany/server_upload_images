
import {Component, ElementRef, OnInit, ViewChild,OnChanges,SimpleChanges} from '@angular/core'
import {ActivatedRoute, Params, Router} from '@angular/router'
import {FormControl, FormGroup, Validators} from '@angular/forms'
import {CategoriesService} from '../shared/services/categories.service'
import {switchMap} from 'rxjs/operators'
import {Observable, of} from 'rxjs'
import {MaterialService} from '../shared/classes/material.service'
import {Category, Position} from '../shared/interfaces'
import {PositionsService} from '../shared/services/positions.service'


@Component({
  selector: 'app-overview-page',
  templateUrl: './overview-page.component.html',
  styleUrls: ['./overview-page.component.css']
})

// export class OverviewPageComponent implements OnChanges {
//   @Input() someHtml: string;
//
//   constructor() {}
//
//   ngOnChanges() {
//     ///** WILL TRIGGER WHEN PARENT COMPONENT UPDATES '**
//
//     console.log(this.someHtml);
//   }
//
// }

export class OverviewPageComponent implements OnInit, OnChanges {

  @ViewChild('input') input: ElementRef
  categories$: Observable<Category[]>
  newCategories$: Observable<Category[]>
  form: FormGroup
  image: File
  imagePreview: string | ArrayBuffer = ''
  idNewDir = 0
  isNew = true
  files: File[] = [];
  newCategories: String[] = [];
  newPositions: Position[] = [];

  category: Category

  constructor(private route: ActivatedRoute,
              private categoriesService: CategoriesService,
              private positionsService: PositionsService,
              private router: Router) {
  }

  ngOnChanges(changes: SimpleChanges) {
    for (let propName in changes) {
      let chng = changes[propName];
      let cur  = JSON.stringify(chng.currentValue);
      let prev = JSON.stringify(chng.previousValue);
      this.log(`${propName}: currentValue = ${cur}, previousValue = ${prev}`);
    }
  }

  ngOnInit() {
    this.categories$ = this.categoriesService.fetch()
    this.form = new FormGroup({
      // name: new FormControl(null, Validators.required)
    })

    this.form.disable()

    this.route.params
      .pipe(switchMap((params: Params) => {
        if (params['id']) {
          this.isNew = false
          return this.categoriesService.getById(params['id'])
        }
        return of(null)
      }))
      .subscribe(
        (category:Category) => {
          if (category) {
            this.category = category
            this.form.patchValue({
              name: this.category.name
            })

            this.imagePreview = this.category.imageSrc
            MaterialService.updateTextInput()
          }
          // this.form.enable()
        },
        error => MaterialService.toast(error.error.message)
      )



    // improveFileUpload();
    //
    // function improveFileUpload() {
    //   const input = document.getElementById("drop-area");
    //
    //   if (!input) {
    //     console.warn("input not found.");
    //     return;
    //   }
    //
    //   if (!(input instanceof HTMLInputElement)) {
    //     console.warn("element is not an input element.");
    //     return;
    //   }
    //
    //   const dropZone = input;
    //   if (dropZone) {
    //     const hoverClassName = "hover";
    //
    //
    //     dropZone.addEventListener("dragenter", function (e) {
    //       e.preventDefault();
    //       dropZone.classList.add(hoverClassName);
    //     });
    //     dropZone.addEventListener("dragover", function (e) {
    //       e.preventDefault();
    //       dropZone.classList.add(hoverClassName);
    //     });
    //     dropZone.addEventListener("dragleave", function (e) {
    //       e.preventDefault();
    //       dropZone.classList.remove(hoverClassName);
    //     });
    //     dropZone.addEventListener("drop", async function (e) {
    //       e.preventDefault();
    //       dropZone.classList.remove(hoverClassName);
    //
    //       const files = await getFilesAsync(e.dataTransfer);
    //       console.log(files);
    //     });
    //   }
    //
    //   dropZone.addEventListener("paste", async function (e) {
    //     e.preventDefault();
    //
    //     const files = await getFilesAsync(e.clipboardData);
    //     console.log(files);
    //   });
    // }



    // ************************ Drag and drop ***************** //
     let dropArea = document.getElementById("drop-area")



// Prevent default drag behaviors
    ;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      dropArea.addEventListener(eventName, preventDefaults, false)
      document.body.addEventListener(eventName, preventDefaults, false)
    })

// Highlight drop area when item is dragged over it
    ;['dragenter', 'dragover'].forEach(eventName => {
      dropArea.addEventListener(eventName, highlight, false)
    })

    ;['dragleave', 'drop'].forEach(eventName => {
      dropArea.addEventListener(eventName, unhighlight, false)
    })

// Handle dropped files
//     dropArea.addEventListener('drop', handleDrop, false)

    dropArea.addEventListener("drop", async  (e) => {
      e.preventDefault();
      // dropArea.classList.remove(hoverClassName);

      await getFilesAsync(e.dataTransfer);

      this.form.enable()


    });

    function preventDefaults (e) {
      e.preventDefault()
      e.stopPropagation()
    }

    function highlight(e) {
      dropArea.classList.add('highlight')
    }

    function unhighlight(e) {
      dropArea.classList.remove('active')
    }

    // async function handleDrop(e) {
    //   var dt = e.dataTransfer
    //   var items = dt.items
    //
    //   const files = await getFilesAsync(e.dataTransfer);
    //   console.log(files);
    // }




    const getFilesAsync = async (dataTransfer: DataTransfer) => {

      // const items = dataTransfer.items;

      // let items = dataTransfer.items[Symbol.iterator]();

      let items = dataTransfer.items;

      // @ts-ignore
      for await (const item of items) {

        if (item.kind === "file") {
          if (typeof item.webkitGetAsEntry === "function") {
            const entry = item.webkitGetAsEntry();

            const nameDir  = normalizeName(entry.fullPath);

            this.newCategories.push(nameDir)


            if (entry.isDirectory) createDir(nameDir)

            show(entry,nameDir);

             continue;
          }else{

            // const file = item.getAsFile();
            // if (file) {
            //   files.push(file);
            // }

          }
        }
      }



      // return files;
    }


    function filterFile (nameFile) {

      let exp =nameFile.split('.').pop();

      if (exp === 'png' || exp === 'jpeg' || exp === 'jpg')
      {
          return true;
      }
      else return false

    }

    const show = async (entry,rootDir) => {

      const files: File[] = [];
      const newPositions: Position[] = []

      if (entry.isDirectory) {
        for await (const newfiles of getEntriesAsAsyncIterator(entry))
        {

          if (newfiles.isFile)
          {
            if (filterFile(newfiles.name)){

              await readEntryContentAsync(newfiles,entry.fullPath,rootDir).then(file => {

                files.push(file)

                const newPosition: Position = {
                  name: file.name,
                  path: entry.fullPath,
                  category: rootDir,
                  categoryName:rootDir,
                  imageSrc: document.location.origin+'/uploads/'+file.name
                }

                newPositions.push(newPosition)

                // updateProgress(i, (e.loaded * 100.0 / e.total) || 100)


              })


            }



          }


          await show(newfiles,rootDir);
        }
      }

      this.files.push(...files)
      this.newPositions.push(...newPositions)

    }

    function newNameFile(rootDir,name) {
     return  normalizeName(rootDir)+'---№'+normalizeName(name)
    }

    function renameNewFile(file,rootDir,patchFile){

      // @ts-ignore
      var newFile = new File([file], newNameFile(patchFile,file.name), {
        type: file.type,
      });

      return newFile;

    }

    // const readEntryContentAsync = async (entry: FileSystemEntry,patchFile,rootDir) => {

    async function readEntryContentAsync(entry: FileSystemEntry,patchFile,rootDir) {

      return new Promise<File>((resolve, reject) => {
        let reading = 0;

        readEntry(entry);

        // this.files = contents;

        function readEntry(entry) {
          if (entry.isFile) {
            reading++;

            entry.file(file => {
              reading--;

              const newFile =  <File>renameNewFile(file,rootDir,patchFile)

//               const obj = { "file": File, "name": "" }

              if (file) {
               // contents.push(newFile);



//                 obj.file = newFile
//                 obj.name = file.name

                // contents.push(obj);

              }

              previewFile(file,rootDir);

              if (reading === 0) {

                
                resolve(newFile);
              }
            });
          }
        }
      });
    }


    async function* getEntriesAsAsyncIterator(dirEntry) {
      const reader = dirEntry.createReader();
      const getNextBatch = () => new Promise((resolve, reject) => {
        reader.readEntries(resolve, reject);
      });

      let flag = true;
      do {
        const entries = await getNextBatch();
        // @ts-ignore
        for (const entry of entries) {
          yield entry;
        }
        // @ts-ignore
        if (isArray(entries) && entries.length > 0) {flag = true;}
        else {
          flag = false;
        }
      } while (flag);
    }

    function isArray(obj) {
      return Object.prototype.toString.call(obj) === '[object Array]';
    }

    function normalizeName(name){

      const badSimvols = '/';

      // const nName = name.replace('/', '')

      const nName = name.split('/').join('');

      return nName;

    }

    const createDir = (name) => {



      this.idNewDir = this.idNewDir+1;

      const createA = document.createElement('a');
      createA.href = name
      createA.innerText = name;
      // createA.id = String(this.idNewDir);
      createA.id = name;
      createA.classList.add('collection-item')

      const newcat = (<HTMLImageElement>document.getElementById('newCat'));

      newcat.appendChild(createA);

    }

    const previewFile = (file,nameDir) => {


        // let inND = String(this.idNewDir);
        let reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onloadend = function() {
        let img = document.createElement('img')
        img.setAttribute('height', '60px');
        img.setAttribute('width', '60px');

        // img.classList.add("img-class")

        // img.setAttribute("id", "img-id")
        const Dir = (<HTMLImageElement>document.getElementById(nameDir));
        // console.log('getElementById '+nameDir)
        // const imgprev = (<HTMLImageElement>document.getElementById('imgprev'));

        if (typeof reader.result === "string") {
          img.src = reader.result
        }

        Dir.appendChild(img)
      }
    }




      // await Promise.all(Object.keys(items).map(async (key) => {
      //
      //  const item = { [key]: items[key as keyof typeof items] };
      //
      //   const entry = item.webkitGetAsEntry();
      //   const entryContent = await readEntryContentAsync(entry);
      //   files.push(...entryContent);
      //
      // }));


      // for (let i = 0; i < dataTransfer.items.length; i++) {
      // @ts-ignore



    // function readEntryContentAsync(entry: FileSystemEntry) {
    //   return new Promise<File[]>((resolve, reject) => {
    //     let reading = 0;
    //     const contents: File[] = [];
    //
    //     readEntry(entry);
    //
    //     function readEntry(entry: FileSystemEntry) {
    //       if (isFile(entry)) {
    //         reading++;
    //         entry.file(file => {
    //           reading--;
    //           contents.push(file);
    //
    //           if (reading === 0) {
    //             resolve(contents);
    //           }
    //         });
    //       } else if (isDirectory(entry)) {
    //         readReaderContent(entry.createReader());
    //       }
    //     }
    //
    //     function readReaderContent(reader: FileSystemDirectoryReader) {
    //       reading++;
    //
    //       reader.readEntries(function (entries) {
    //         reading--;
    //         for (const entry of entries) {
    //           readEntry(entry);
    //         }
    //
    //         if (reading === 0) {
    //           resolve(contents);
    //         }
    //       });
    //     }
    //   });
    // }
    //
    // function isDirectory(entry: FileSystemEntry): entry is FileSystemDirectoryEntry {
    //   return entry.isDirectory;
    // }
    //
    // function isFile(entry: FileSystemEntry): entry is FileSystemFileEntry {
    //   return entry.isFile;
    // }
    //
    // interface FileSystemEntry {
    //   fullPath: string;
    //   isFile: boolean;
    //   isDirectory: boolean;
    //   name: string;
    //
    //   getMetadata(successCallback: (metadata: Metadata) => void, errorCallback?: (error: FileError) => void): void;
    // }
    //
    // interface FileSystemFileEntry extends FileSystemEntry {
    //   file(successCallback: (file: File) => void, errorCallback?: (error: FileError) => void): void;
    // }
    //
    // interface FileSystemDirectoryEntry extends FileSystemEntry {
    //   createReader(): FileSystemDirectoryReader;
    //   getDirectory(): FileSystemDirectoryEntry;
    //   getFile(): FileSystemFileEntry;
    // }
    //
    // interface DataTransferItem {
    //   webkitGetAsEntry?(): FileSystemEntry;
    // }
    //
    // interface FileSystemDirectoryReader {
    //   readEntries(successCallback: (entries: FileSystemEntry[]) => void, errorCallback?: (error: FileError) => void): void;
    // }
    //
    // interface Metadata {
    //   modificationTime: Date;
    //   size: number;
    // }
    //
    // interface FileError extends Error {
    // }



    // ************************ Drag and drop ***************** //
    // let dropArea = document.getElementById("drop-area")

//
//
// // Prevent default drag behaviors
//     ;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
//       dropArea.addEventListener(eventName, preventDefaults, false)
//       document.body.addEventListener(eventName, preventDefaults, false)
//     })
//
// // Highlight drop area when item is dragged over it
//     ;['dragenter', 'dragover'].forEach(eventName => {
//       dropArea.addEventListener(eventName, highlight, false)
//     })
//
//     ;['dragleave', 'drop'].forEach(eventName => {
//       dropArea.addEventListener(eventName, unhighlight, false)
//     })
//
// // Handle dropped files
//     dropArea.addEventListener('drop', handleDrop, false)
//
//     function preventDefaults (e) {
//       e.preventDefault()
//       e.stopPropagation()
//     }
//
//     function highlight(e) {
//       dropArea.classList.add('highlight')
//     }
//
//     function unhighlight(e) {
//       dropArea.classList.remove('active')
//     }
//
//     function handleDrop(e) {
//       var dt = e.dataTransfer
//       var items = dt.items
//
//       handleFiles(items)
//     }
//
//     const handleFiles = (items) => {
//       // files = [...files]
//       initializeProgress(items.length)
//       // files.forEach(uploadFile)
//       // files.forEach(previewFile)
//
//       // console.log('tems.length '+String(items.length))
//       for (var i = 0; i < items.length; i++) {
//
//         let item = items[i].webkitGetAsEntry();
//
//         this.idNewDir = this.idNewDir+1;
//         console.log(String(this.idNewDir))
//         console.log(String(item.name))
//         createDir(item.name)
//
//         if (item) {scanFiles(item,i);}
//       }
//
//
//     }
//
//     const createDir = (name) => {
//
//       const createA = document.createElement('a');
//       createA.href = name+' '+String(this.idNewDir);
//       createA.innerText = name;
//       createA.id = String(this.idNewDir);
//       createA.classList.add('collection-item')
//
//       const newcat = (<HTMLImageElement>document.getElementById('newCat'));
//
//       newcat.appendChild(createA);
//
//     }
//
//
//     const scanFiles = (item,i) => {
//
//       // elem.textContent = item.name;
//
//
//       if (item.isDirectory) {
//
//         let directoryReader = item.createReader();
//         // console.log(11)
// // console.log(item)
//         directoryReader.readEntries(function(entries) {
//           entries.forEach(function(entry) {
//             // console.log('--------')
//             // console.log(entry)
//             i=i+1
//             scanFiles(entry,i);
//           });
//         });
//
//
//       } else{
//         // console.log(22)
//         // console.log(item)
//         item.file(function(file) {
//           // if(file.type.match(/image.*/)){
//           //     upload(file);
//           // }
//           // console.log(33)
//           // console.log(file)
//           //  uploadFile(file, i);
//            previewFile(file)
//
//         });
//
//
//       }
//     }
//
//
//
//     let uploadProgress = []
//     let progressBar = (<HTMLInputElement>document.getElementById('progress-bar'))
//
//     function initializeProgress(numFiles) {
//       progressBar.value = String(0)
//       uploadProgress = []
//
//       for(let i = numFiles; i > 0; i--) {
//         uploadProgress.push(0)
//       }
//     }
//
//     function updateProgress(fileNumber, percent) {
//       uploadProgress[fileNumber] = percent
//       let total = uploadProgress.reduce((tot, curr) => tot + curr, 0) / uploadProgress.length
//       progressBar.value = String(total)
//     }
//
//
//
//     const previewFile = (file) => {
//       let inND = String(this.idNewDir);
//       let reader = new FileReader()
//       reader.readAsDataURL(file)
//       reader.onloadend = function() {
//          let img = document.createElement('img')
//         img.setAttribute('height', '100px');
//         img.setAttribute('width', '100px');
//
//         // img.classList.add("img-class")
//
//         // img.setAttribute("id", "img-id")
//         const Dir = (<HTMLImageElement>document.getElementById(inND));
//         console.log('getElementById '+inND)
//         // const imgprev = (<HTMLImageElement>document.getElementById('imgprev'));
//
//         if (typeof reader.result === "string") {
//           img.src = reader.result
//         }
//
//
//         Dir.appendChild(img)
//       }
//     }
//
//     function uploadFile(file, i) {
//
//       // let obs$
//       // obs$ = this.categoriesService.create(this.form.value.name, this.image)
//
//       // var url = 'https://api.cloudinary.com/v1_1/joezimim007/image/upload'
//       // var xhr = new XMLHttpRequest()
//       // var formData = new FormData()
//       // xhr.open('POST', url, true)
//       // xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
//       //
//       // // Update progress (can be used to show progress indicator)
//       // xhr.upload.addEventListener("progress", function(e) {
//       //   updateProgress(i, (e.loaded * 100.0 / e.total) || 100)
//       // })
//       //
//       // xhr.addEventListener('readystatechange', function(e) {
//       //   if (xhr.readyState == 4 && xhr.status == 200) {
//       //     updateProgress(i, 100) // <- Add this
//       //   }
//       //   else if (xhr.readyState == 4 && xhr.status != 200) {
//       //     // Error. Inform the user
//       //   }
//       // })
//       //
//       // formData.append('upload_preset', 'ujpu6gyk')
//       // formData.append('file', file)
//       // xhr.send(formData)
//     }
//
//
//
//   }
//
//
//
//
}


  onSubmit() {
    let obs$
    this.form.disable()
    if (this.isNew) {

      obs$ = this.categoriesService.create(this.newCategories)
      // console.log('2new cat !!!!!!!!!!!!!!!!!!!!!!!!'+this.newCategories)

    //   this.positionsService.create(this.newPositions,this.files).subscribe(
    //     position => {
    //       // this.positions.push(position)
    //       MaterialService.toast('Изменения сохранены')
    //     },
    //     error => {
    //       this.form.enable()
    //       MaterialService.toast(error.error.message)
    //     }
    //     // completed
    // )


    } else {
      obs$ = this.categoriesService.update(this.category.id, this.form.value.name, this.image)
    }

   // const reloadelement = async  (url: string) => {
   //
   //    await this.router.navigateByUrl('.', { skipLocationChange: true });
   //    return this.router.navigateByUrl(url);
   //
   //  }


    const createPositions = (pushNewPositions,pushFiles) =>
    {

      return new Promise<void>((resolve, reject) => {
      //
      // }

      // let promise = new Promise((resolve, reject) => {
        this.positionsService.create(pushNewPositions, pushFiles).subscribe(
          position => {
            MaterialService.toast('Изменения сохранены % ')
            resolve();
          },
          error => {
            this.form.enable()
            MaterialService.toast(error.error.message)
            reject(error.error.message)
          }
          // completed
        )
      })
    }

    const pushAllFiles = async (pushNewPositions,pushFiles) =>{
      createPositions(pushNewPositions,pushFiles)
    }

    obs$.subscribe(
      async categories => {
        this.category = categories

        // MaterialService.toast('Изменения сохранены')
        this.form.enable()

        categories.forEach(category => {
          let id = category[0].id
          let squ = category[0].squ
          this.newPositions.forEach(function(v){
            if (v.category == squ) {
              v.category = id
            }
          });})


        let  pushFiles: File[] = [];
        let  pushNewPositions: Position[] = []
        let i=0;

        for await (const item of this.files) {

          pushFiles.push(this.files[i])
          pushNewPositions.push(this.newPositions[i])

                this.positionsService.create(pushNewPositions, pushFiles).subscribe(
                  position => {
                    MaterialService.toast('Изменения сохранены % ')



                    // if (i==this.files.length-1){
                    //
                    //     this.router.navigate(['/overview'])
                    //                    .then(() => {
                    //                      window.location.reload();
                    //                    })
                    //     }

                  },
                  error => {
                    this.form.enable()
                    MaterialService.toast(error.error.message)

                  }
                  // completed
                )



          // await pushAllFiles(pushNewPositions,pushFiles)

          pushFiles.length =0
          pushNewPositions.length =0

          i++

        }




        // const stepDownload = 10;
        //
        // let  pushFiles: File[] = [];
        // let  pushNewPositions: Position[] = [];
        //
        // for (let i = 0; i < this.files.length; i++) {
        //
        //       pushFiles.push(this.files[i])
        //       pushNewPositions.push(this.newPositions[i])
        //
        //      if (i==this.files.length-1){
        //        createPositions(pushNewPositions,pushFiles).then(
        //
        //            res => { // Success
        //              this.router.navigate(['/overview'])
        //                .then(() => {
        //                  window.location.reload();
        //                })
        //            },
        //
        //              error => MaterialService.toast(error.error.message)
        //
        //
        //        )
        //
        //        pushFiles.length =0
        //        pushNewPositions.length =0
        //
        //      }else{
        //
        //          if (i%stepDownload === 0 && i!==0){
        //
        //            createPositions(pushNewPositions,pushFiles).then(
        //
        //              res => { // Success
        //                MaterialService.toast('save ok!')
        //              },
        //
        //              error => MaterialService.toast(error.error.message)
        //
        //            )
        //
        //            pushFiles.length =0
        //            pushNewPositions.length =0
        //
        //          }
        //      }
        //
        //
        //
        // }

      },
      error => {
        MaterialService.toast(error.error.message)
        this.form.enable()
      },
        // () => this.router.navigate(['/overview'])


      //   () => this.router.navigate(['/overview'])
      // .then(() => {
      //    window.location.reload();
      // })


    )


  }





  deleteOneCategory() {
    const decision = window.confirm('Вы уверены, что хотите удалить категорию?')
    if (decision) {
      this.categoriesService.delete(this.category.id).subscribe(
        response => MaterialService.toast(response.message),
        error => MaterialService.toast(error.error.message),
        () => this.router.navigate(['/categories'])
      )
    }
  }

  deleteCategory(event, category: Category) {
    // event.stopPropagation()
    const decision = window.confirm('Вы уверены, что хотите удалить категорию?')
    if (decision) {
      this.categoriesService.delete(category.id).subscribe(
        response => {

          MaterialService.toast(response.message)
        },
        error => MaterialService.toast(error.error.message),
        () => this.router.navigate(['/overview'])
      )
    }
  }

  onFileSelect(event) {
    const file = event.target.files[0]
    this.image = file

    const reader = new FileReader()



    reader.onload = () => {
      this.imagePreview = reader.result
      // console.log('img test '+reader.result)
    }

    reader.readAsDataURL(file)
  }

  triggerClick() {
    this.input.nativeElement.click()
  }

  private log(msg: string) {
    console.log('!!!!!+++++++++++++++++'+msg);
  }
}
