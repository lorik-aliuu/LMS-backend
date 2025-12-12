    using AutoMapper;
    using LMS.Application.DTOs.Users;
    using LMS.Application.RepositoryInterfaces;
    using LMS.Application.ServiceInterfaces;
    using LMS.Domain.Exceptions;
    using LMS.Infrastructure.Identity;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.AspNetCore.SignalR;
    using Microsoft.EntityFrameworkCore;
    using System;
    using System.Collections.Generic;
    using System.Data;
    using System.Linq;
    using System.Text;
    using System.Threading.Tasks;

    namespace LMS.Infrastructure.Services
    {
        public class UserService : IUserService
        {
            private readonly UserManager<ApplicationUser> _userManager;
            private readonly IBookRepository _bookRepository;
            private readonly IMapper _mapper;
            private readonly IUserNotifierService _userNotifier;


            public UserService(
                UserManager<ApplicationUser> userManager,
                IBookRepository bookRepository,
                IMapper mapper,
                IUserNotifierService userNotifier
               )
            {
                _userManager = userManager;
                _bookRepository = bookRepository;
                _mapper = mapper;
                _userNotifier = userNotifier;


            }

   

        public async Task<UserProfileDTO> GetUserProfileAsync(string userId)
            {


                var user = await _userManager.FindByIdAsync(userId);

                if (user == null)
                {
                    throw new NotFoundException("User", userId);
                }

                var roles = await _userManager.GetRolesAsync(user);
                var bookCount = await _bookRepository.GetBookCountByUserAsync(userId);

                var profile =  new UserProfileDTO
                {
                    UserId = user.Id,
                    UserName = user.UserName!,
                    Email = user.Email!,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    FullName = user.FullName,
                    PhoneNumber = user.PhoneNumber,
                    DateOfBirth = user.DateOfBirth,
                    ProfilePictureUrl = user.ProfilePictureUrl,
                    CreatedAt = user.CreatedAt,
                    Role = roles.FirstOrDefault() ?? "User",
                    TotalBooks = bookCount
                };
               
                return profile;
            }


            public async Task<UserProfileDTO> UpdateUserProfileAsync(string userId, UpdateUserDTO updateDto)
            {
                var user = await _userManager.FindByIdAsync(userId);

                if (user == null)
                {
                    throw new NotFoundException("User", userId);
                }

                user.FirstName = updateDto.FirstName;
                user.LastName = updateDto.LastName;
                user.PhoneNumber = updateDto.PhoneNumber;
                user.DateOfBirth = updateDto.DateOfBirth;
           

                var result = await _userManager.UpdateAsync(user);

                if (!result.Succeeded)
                {
                    var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                    throw new ValidationException($"Profile update failed: {errors}");
                }

              

                return await GetUserProfileAsync(userId);
            }

            public async Task<bool> ChangePasswordAsync(string userId, ChangePasswordDTO changePasswordDto)
            {
                var user = await _userManager.FindByIdAsync(userId);

                if (user == null)
                {
                    throw new NotFoundException("User", userId);
                }

                var result = await _userManager.ChangePasswordAsync(
                    user,
                    changePasswordDto.CurrentPassword,
                    changePasswordDto.NewPassword
                );

                if (!result.Succeeded)
                {
                    var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                    throw new ValidationException($"Password change failed: {errors}");
                }
                return true;
            }

            public async Task<bool> DeleteAccountAsync(string userId, string password)
            {
                var user = await _userManager.FindByIdAsync(userId);

                if (user == null)
                {
                    throw new NotFoundException("User", userId);
                }

            
                var isPasswordValid = await _userManager.CheckPasswordAsync(user, password);
                if (!isPasswordValid)
                {
                    throw new UnauthorizedException("Invalid password");
                }

                var userBooks = await _bookRepository.GetBooksByUserIdAsync(userId);
                foreach (var book in userBooks)
                {
                    await _bookRepository.DeleteAsync(book);
                }
                await _bookRepository.SaveChangesAsync();

           
                var result = await _userManager.DeleteAsync(user);

                if (!result.Succeeded)
                {
                    var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                    throw new ValidationException($"Account deletion failed: {errors}");
                }

                await _userNotifier.NotifyAccountDeletedAsync(userId);

                return true;
            }

            public async Task<IEnumerable<UserProfileDTO>> GetAllUsersAsync()
            {
                var users = await _userManager.Users.ToListAsync();
                var userProfiles = new List<UserProfileDTO>();

                foreach (var user in users)
                {
                    var roles = await _userManager.GetRolesAsync(user);
                    var bookCount = await _bookRepository.GetBookCountByUserAsync(user.Id);

                    userProfiles.Add(new UserProfileDTO
                    {
                        UserId = user.Id,
                        UserName = user.UserName!,
                        Email = user.Email!,
                        FirstName = user.FirstName,
                        LastName = user.LastName,
                        FullName = user.FullName,
                        PhoneNumber = user.PhoneNumber,
                        DateOfBirth = user.DateOfBirth,
                        ProfilePictureUrl = user.ProfilePictureUrl,
                        CreatedAt = user.CreatedAt,
                        Role = roles.FirstOrDefault() ?? "User",
                        TotalBooks = bookCount
                    });
                }

                return userProfiles;
            }

            public async Task<UserProfileDTO> GetUserByIdAsync(string userId)
            {
                return await GetUserProfileAsync(userId);
            }

            public async Task<bool> DeleteUserAsync(string userId)
            {
                var user = await _userManager.FindByIdAsync(userId);

                if (user == null)
                {
                    throw new NotFoundException("User", userId);
                }

                var userBooks = await _bookRepository.GetBooksByUserIdAsync(userId);
                foreach (var book in userBooks)
                {
                    await _bookRepository.DeleteAsync(book);
                }
                await _bookRepository.SaveChangesAsync();

           
                var result = await _userManager.DeleteAsync(user);

                if (!result.Succeeded)
                {
                    var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                    throw new ValidationException($"User deletion failed: {errors}");
                }

                await _userNotifier.NotifyAccountDeletedAsync(userId);

                return true;
            }

            public async Task<bool> UpdateUserRoleAsync(string userId, string role)
            {
                var user = await _userManager.FindByIdAsync(userId);

                if (user == null)
                {
                    throw new NotFoundException("User", userId);
                }

                if (role != "User" && role != "Admin")
                {
                    throw new ValidationException("Invalid role. Must be 'User' or 'Admin'");
                }

                var currentRoles = await _userManager.GetRolesAsync(user);
                await _userManager.RemoveFromRolesAsync(user, currentRoles);

                var result = await _userManager.AddToRoleAsync(user, role);

                if (!result.Succeeded)
                {
                    var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                    throw new ValidationException($"Role update failed: {errors}");
                }

           
                await _userManager.UpdateSecurityStampAsync(user);
                await _userNotifier.NotifyUserRoleChangedAsync(userId, role);

                return true;
            }
        }


    }
