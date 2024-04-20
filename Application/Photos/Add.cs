using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Photos
{
    public class Add
    {
        public class Commond :IRequest<Result<Photo>>
        {
            public IFormFile File { get; set; }

        }

        public class Handler : IRequestHandler<Commond, Result<Photo>>
        {
            private readonly DataContext _context;
            private readonly IPhotoAccessor _photoAccessor;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context,
                IPhotoAccessor photoAccessor,
                IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _context = context;
                _photoAccessor = photoAccessor;
            }
            public async Task<Result<Photo>> Handle(Commond request, CancellationToken cancellationToken)
            {
                var user=await _context.Users.Include(p=>p.Photos)
                    .FirstOrDefaultAsync(x=>x.UserName==_userAccessor.GetUserName());

                if(user==null) return null;

                var photoUploadResult=await _photoAccessor.AddPhoto(request.File);
                
                var photo=new Photo
                {
                    Url=photoUploadResult.Url,
                    Id=photoUploadResult.PublicId
                };

                if(!user.Photos.Any(x=>x.IsMain)) photo.IsMain=true;

                user.Photos.Add(photo);

                var result=await _context.SaveChangesAsync()>0;

                if(result)
                    return Result<Photo>.Success(photo);
                
                return Result<Photo>.Failure("Problem adding photo");

            }
        }

    }
}