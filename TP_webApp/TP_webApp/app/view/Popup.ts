import * as $ from 'jquery';

export function createPopup(input: { [name: string]: string | string[] }): Promise<{[name:string]:string}> {
    
    $('#popupBody').empty();
    for(var key in input){
        if (input[key] instanceof Array) {
            $('#popupBody').append('<div class="form-group" id="'+key+'_form"> </div>');
            $('#'+key+'_form').append('<label for="combo_'+key+'">'+key+':</label>');
            $('#' + key + '_form').append('<select class="form-control" id="combo_'+key+'"></select>');
            (input[key] as Array<any>).forEach(element => {
                $('#combo_'+key).append('<option value="'+element+'">'+element+'</option>');
            });
            
      
        }else{

            $('#popupBody').append('<div class="form-group" id="' + key +'_form">');
            $('#' + key + '_form').append('<label for="field_'+key+'">'+key+':</label>');
           
            if(input[key] == null){
                $('#' + key + '_form').append('<input class="form-control" type="text" id="field_'+key+'" placeholder="'+key+'">');
            }else{
                $('#' + key + '_form').append('<input class="form-control" type="text" id="field_'+key+'" placeholder="'+key+'" value="'+input[key]+'">');
            }
        }
        
        $('#popupBody').append('<hr>')
    }

    $('#popupWindow').modal({ backdrop: 'static' });
    $('#popupWindow').modal('toggle');

    return new Promise<{[name:string]:string}>((resolve, reject) => {
         $('#submitButton').off().on('click', () => {
            var output:{[name:string]:string} = {};
            for(var key in input){
                
                if(input[key] instanceof Array){
                    output[key] = $('#combo_'+key).val() as string;
                } 
                else{
                    output[key] = $('#field_'+key).val() as string;
                }
            }
            resolve(output);
        });
    });

}