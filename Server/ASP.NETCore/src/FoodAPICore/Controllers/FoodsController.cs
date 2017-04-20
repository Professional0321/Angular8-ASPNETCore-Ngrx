﻿using System;
using System.Linq;
using AutoMapper;
using FoodAPICore.Models;
using FoodAPICore.ViewModels;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using FoodAPICore.Repositories;
using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;

namespace FoodAPICore.Controllers
{
    [Route("api/[controller]")]
    [Authorize(Policy = "Access Resources")] // Authorization policy for this API.
    public class FoodsController : Controller
    {
        private readonly IFoodRepository _foodRepository;

        public FoodsController(IFoodRepository foodRepository)
        {
            _foodRepository = foodRepository;
        }

        [HttpGet]
        [AllowAnonymous]
        public IActionResult Get()
        {
            ICollection<FoodItem> foodItems = _foodRepository.GetAll();
            IEnumerable<FoodItemViewModel> viewModels = foodItems
                .Select(x => Mapper.Map<FoodItemViewModel>(x));

            return Ok(viewModels);
        }

        [HttpGet("GetRandomMeal")]
        [AllowAnonymous]
        public IActionResult GetRandomMeal()
        {
            ICollection<FoodItem> foodItems = _foodRepository.GetRandomMeal();
            IEnumerable<FoodItemViewModel> viewModels = foodItems
                .Select(x => Mapper.Map<FoodItemViewModel>(x));

            return Ok(viewModels);
        }

        [HttpPost]
        [Authorize(Policy = "Modify Resources")]
        public IActionResult Add([FromBody] FoodItemViewModel foodItemViewModel)
        {
            if (foodItemViewModel == null)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            FoodItem toAdd = Mapper.Map<FoodItem>(foodItemViewModel);

            _foodRepository.Add(toAdd);

            if (!_foodRepository.Save())
            {
                throw new Exception("Creating a fooditem failed on save.");
            }

            FoodItem newFoodItem = _foodRepository.GetSingle(toAdd.Id);

            return CreatedAtRoute("GetSingleFood", new { id = newFoodItem.Id },
                Mapper.Map<FoodItemViewModel>(newFoodItem));
        }

        [HttpPatch("{id}")]
        [Authorize(Policy = "Modify Resources")]
        public IActionResult PartiallyUpdate(Guid id, [FromBody] JsonPatchDocument<FoodItemViewModel> patchDoc)
        {
            if (patchDoc == null)
            {
                return BadRequest();
            }

            FoodItem existingEntity = _foodRepository.GetSingle(id);

            if (existingEntity == null)
            {
                return NotFound();
            }

            FoodItemViewModel foodItemViewModel = Mapper.Map<FoodItemViewModel>(existingEntity);
            patchDoc.ApplyTo(foodItemViewModel, ModelState);

            TryValidateModel(foodItemViewModel);

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            FoodItem updated = _foodRepository.Update(id, Mapper.Map<FoodItem>(foodItemViewModel));

            if (!_foodRepository.Save())
            {
                throw new Exception("Updating a fooditem failed on save.");
            }

            return Ok(Mapper.Map<FoodItemViewModel>(updated));
        }

        [HttpGet]
        [Route("{id}", Name = "GetSingleFood")]
        [AllowAnonymous]
        public IActionResult Single(Guid id)
        {
            FoodItem foodItem = _foodRepository.GetSingle(id);

            if (foodItem == null)
            {
                return NotFound();
            }

            return Ok(Mapper.Map<FoodItemViewModel>(foodItem));
        }

        [HttpDelete]
        [Route("{id}")]
        [Authorize(Policy = "Modify Resources")]
        public IActionResult Remove(Guid id)
        {
            FoodItem foodItem = _foodRepository.GetSingle(id);

            if (foodItem == null)
            {
                return NotFound();
            }

            _foodRepository.Delete(id);

            if (!_foodRepository.Save())
            {
                throw new Exception("Deleting a fooditem failed on save.");
            }

            return NoContent();
        }

        [HttpPut]
        [Route("{id}")]
        [Authorize(Policy = "Modify Resources")]
        public IActionResult Update(Guid id, [FromBody]FoodItemUpdateViewModel foodItem)
        {
            var existingFoodItem = _foodRepository.GetSingle(id);

            if (existingFoodItem == null)
            {
                return NotFound();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Mapper.Map(foodItem, existingFoodItem);

            FoodItem update = _foodRepository.Update(id, existingFoodItem);

            if (!_foodRepository.Save())
            {
                throw new Exception("Updating a fooditem failed on save.");
            }

            return Ok(Mapper.Map<FoodItemViewModel>(update));
        }
    }
}
