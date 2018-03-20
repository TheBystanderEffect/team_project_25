import * as $ from 'jquery';

export function createPopup(input: { [name: string]: string | string[] }): Promise<{[name:string]:string}> {
   
    $('#popupBody').empty();
    for(var key in input){
        if(input[key] instanceof Array){
            $('#popupBody').append('<label for="combo_'+key+'">'+key+' </label>');
            $('#popupBody').append('<select id="combo_'+key+'"></select>');
            (input[key] as Array<any>).forEach(element => {
                $('#combo_'+key).append('<option value="'+element+'">'+element+'</option>');
            });
      
        }else{
            
            $('#popupBody').append('<label for="field_'+key+'">'+key+' </label>');
           
            if(input[key] == null){
                $('#popupBody').append('<input type="text" id="field_'+key+'" placeholder="'+key+'">');
            }else{
                $('#popupBody').append('<input type="text" id="field_'+key+'" placeholder="'+key+'" value="'+input[key]+'">');
            }
        }
        $('#popupBody').append('<hr>')
    }

    return new Promise<{[name:string]:string}>((resolve, reject) => {
         $('#submitButton').off().on('click', () => {
            var outpur:{[name:string]:string} = {};
            for(var key in input){
                
                if(input[key] instanceof Array){
                    outpur[key] = $('#combo_'+key).val() as string;
                } 
                else{
                    outpur[key] = $('#field_'+key).val() as string;
                }
            }
            resolve(outpur);
        })
    });

}

export function savePopup(): void {

}