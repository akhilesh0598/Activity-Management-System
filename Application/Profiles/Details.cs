
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles
{
    public class Details
    {
        public class Query : IRequest<Result<Profile>>
        {
            public string Username { get; set; }

        }

        public class Handler : IRequestHandler<Query, Result<Profile>>
        {
            private readonly DataContext _dataContext;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _accessor;

            public Handler(DataContext dataContext,
                IMapper mapper,
                IUserAccessor accessor)
            {
                _dataContext = dataContext;
                _mapper = mapper;
                _accessor = accessor;
            }

            public async Task<Result<Profile>> Handle(Query request, CancellationToken cancellationToken)
            {
                var user=await _dataContext.Users
                    .ProjectTo<Profile>(_mapper.ConfigurationProvider,new {currentUsername=_accessor.GetUserName()})
                    .SingleOrDefaultAsync(x=>x.Username==request.Username);

                if(user==null)
                    return null;
                
                return Result<Profile>.Success(user);
            }
        }

    }
}