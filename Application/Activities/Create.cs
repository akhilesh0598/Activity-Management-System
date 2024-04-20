using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.Xml;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Domain;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Create
    {
        public class Command:IRequest<Result<Unit>>
        {
            public Activity Activity { get; set; }
        }
        public class CommandValidator:AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x=>x.Activity).SetValidator(new ActivityValidator());
            }
        }
        public class Handler : IRequestHandler<Command,Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context,IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _context = context;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user=_context.Users.FirstOrDefault(x => x.UserName==_userAccessor.GetUserName());

                var attendee= new ActivityAttendee
                {
                    AppUser=user,
                    Activity=request.Activity,
                    IsHost=true
                };
                request.Activity.Attendees.Add(attendee);
                _context.Activities.Add(request.Activity);
                var result =await _context.SaveChangesAsync();
                if(result>0)
                    return Result<Unit>.Failure("Failed to create activity!");
                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}