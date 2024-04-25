using System.Linq;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class List
    {
        public class Query : IRequest<Result<PagedList<ActivityDto>>> 
        { 
            public ActivityParams PagingParams { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<PagedList<ActivityDto>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _accessor;

            public Handler(DataContext context,
                IMapper mapper,IUserAccessor accessor)
            {
            _accessor = accessor;
                _context = context;
                _mapper = mapper;
            }
            public async Task<Result<PagedList<ActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var query= _context.Activities
                .Where(d=>d.Date>=request.PagingParams.StartDate)
                .OrderBy(d=>d.Date)
                .ProjectTo<ActivityDto>(_mapper.ConfigurationProvider,new {currentUsername=_accessor.GetUserName()})
                .AsQueryable();
                if(request.PagingParams.IsGoing && !request.PagingParams.IsHost)
                {
                    query = query.Where(d=>d.Attendees.Any(a=>a.Username==_accessor.GetUserName()));
                }
                if(request.PagingParams.IsHost && !request.PagingParams.IsGoing)
                {
                    query=query.Where(d=>d.HostUsername==_accessor.GetUserName());
                }
                return Result<PagedList<ActivityDto>>.Success(
                    await PagedList<ActivityDto>.CreateAsync(query,request.PagingParams.PageNumber,request.PagingParams.PageSize)

                );
            }
        }

    }
}