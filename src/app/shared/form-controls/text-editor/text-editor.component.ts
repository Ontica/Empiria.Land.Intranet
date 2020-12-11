import { Component, forwardRef} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';


@Component({
  selector: 'emp-ng-text-editor',
  templateUrl: './text-editor.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextEditorComponent),
      multi: true
    }
  ]
})

export class TextEditorComponent implements ControlValueAccessor {
  value: any;
  onChange: (value: any) => void;
  onTouched: () => void;
  disabled: boolean;

  editorModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered'}, { list: 'bullet' }],
      ['link'],
      ['clean'],
    ]
  };

  constructor() { }

  writeValue(value: any): void {
    this.value = value ? value : '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  setFocus(editor) {
    editor.focus();
  }
}
