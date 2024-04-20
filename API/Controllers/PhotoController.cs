using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Photos;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class PhotoController :BaseApiController
    {
        [HttpPost]
        public async Task<IActionResult> Add([FromForm] Add.Commond commond)
        {
            return HandleResult(await Mediator.Send(commond));
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            return HandleResult(await Mediator.Send(new Delete.Commond{Id=id}));
        }

        [HttpPost("{id}/setMain")]
        public async Task<IActionResult> SetMain(string id)
        {
            return HandleResult(await Mediator.Send(new SetMain.Commond{Id=id}));
        }
        
    }
}