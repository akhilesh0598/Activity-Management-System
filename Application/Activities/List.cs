using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class List
    {
        public class Query : IRequest<Result<PagedList<ActivityDto>>> 
        { 
            public ActivityParams Params { get; set; }
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
                .Where(d=>d.Date>=request.Params.StartDate)
                .OrderBy(d=>d.Date)
                .ProjectTo<ActivityDto>(_mapper.ConfigurationProvider,new {currentUsername=_accessor.GetUserName()})
                .AsQueryable();
                if(request.Params.IsGoing && !request.Params.IsHost)
                {
                    query = query.Where(d=>d.Attendees.Any(a=>a.Username==_accessor.GetUserName()));
                }
                if(request.Params.IsHost && !request.Params.IsGoing)
                {
                    query=query.Where(d=>d.HostUsername==_accessor.GetUserName());
                }
                return Result<PagedList<ActivityDto>>.Success(
                    await PagedList<ActivityDto>.CreateAsync(query,request.Params.PageNumber,request.Params.PageSize)

                );
            }
        }

    }
}