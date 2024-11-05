package com.talentmatch2.Controllers;

import com.talentmatch2.Models.Role;
import com.talentmatch2.Services.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/roles")
public class RoleController {

    private final RoleService roleService;

    @Autowired
    public RoleController(RoleService roleService) {
        this.roleService = roleService;
    }

    // Create a new role
    @PostMapping
    public String saveRole(@RequestBody Role role) {
        return roleService.saveRole(role);
    }

    // Get all roles
    @GetMapping
    public List<Role> getAllRoles() {
        return roleService.getAllRoles();
    }

    // Get a role by ID
    @GetMapping("/{id}")
    public Role getRoleById(@PathVariable String id) {
        return roleService.getRoleById(id);
    }

    // Update a role by ID
    @PutMapping("/{id}")
    public String updateRole(@PathVariable String id, @RequestBody Role role) {
        return roleService.updateRole(id, role);
    }

    // Delete a role by ID
    @DeleteMapping("/{id}")
    public String deleteRole(@PathVariable String id) {
        return roleService.deleteRole(id);
    }
}
